const Events = require("../events");
const Validation = require("../../helpers/validate");
const GameStore = require("../../stores/game.store");
const PlayerStore = require("../../stores/player.store");
const ValidationSchemas = require("../../schemas/validation.schema");

const GameModeLookup = {
	mablibs: require("./madlibs.handler"),
	scramble: require("./scramble.handler"),
};

class GameHandler {
	/**
	 * Create a game and add it to the GameStore
	 * @param {Object} io IO instance from socket.io
	 * @param {Object} socket Socket instance from the current connection
	 * @param {Object} data Data sent from the client
	 */
	create = async (io, socket, data) => {
		/* Validate the incoming data */
		const { status, error } = Validation.Validate(
			data,
			ValidationSchemas.gateway.createGame
		);

		if (!status) return socket.emit(Events.ERROR_OCCURRED, error);

		/* Get the game name and players allowed, then create the game */
		let { game_name, players_allowed } = data;
		let currentGame = GameStore.add(game_name, socket.id, players_allowed);

		/* Add the player to the game room */
		socket.game_id = currentGame.game_id;
		socket.join(currentGame.game_id); // skipcq: JS-D008

		/* Broadcast game creation to all clients */
		io.sockets.emit(Events.GAME_CREATED, currentGame);
	};

	/**
	 * Start the current game if the player is the host
	 * @param {Object} io IO instance from socket.io
	 * @param {Object} socket Socket instance from the current connection
	 * @param {Object} data Data sent from the client
	 */
	start = async (io, socket, data) => {
		/* Validate the incoming data */
		const { status, error } = Validation.Validate(
			data,
			ValidationSchemas.gateway.startGame
		);
		if (!status) return socket.emit(Events.ERROR_OCCURRED, error);

		/* Get the game ID, then check if the player is the host */
		let { game_id } = data;
		if (!GameStore.isHost(game_id, socket.id, "checkStart")) {
			return socket.emit(
				Events.ERROR_OCCURRED,
				"You are not the host of this game."
			);
		}

		/* Check if the game exists and if there are enough players to start */
		let currentGame = GameStore.find(game_id).game;
		let playersInGame = PlayerStore.all(game_id);

		if (!currentGame)
			return socket.emit(Events.ERROR_OCCURRED, "Game does not exist.");
		if (playersInGame.length <= 1)
			return socket.emit(
				Events.ERROR_OCCURRED,
				"Not enough players to start game."
			);

		/* Start the game, toggle the status */
		GameStore.toggleGameStarted(game_id);

		/* Broadcast game start to all clients */
		io.to(game_id).emit(Events.GAME_STARTING);

		/* Start the requested game mode */
		let modeInstance = new GameModeLookup[currentGame.mode](io, socket);
		modeInstance.init();
	};

	/**
	 * Join a game if it exists and there is space for another player
	 * @param {Object} io IO instance from socket.io
	 * @param {Object} socket Socket instance from the current connection
	 * @param {Object} data Data sent from the client
	 */
	join = async (io, socket, data) => {
		/* Validate the incoming data */
		const { status, error } = Validation.Validate(
			data,
			ValidationSchemas.gateway.joinGame
		);
		if (!status) return socket.emit(Events.ERROR_OCCURRED, error);

		/* Get the game ID and nickname, then check if the game exists */
		let { game_id, nickname } = data;
		if (GameStore.gameExists(game_id)) {
			/* Check if the game is full, and if it has already started */
			let playerCount = GameStore.getPlayerCount(game_id);
			if (playerCount.current == playerCount.allowed)
				return socket.emit(Events.ERROR_OCCURRED, "Game is full.");

			if (GameStore.get(game_id, "started"))
				return socket.emit(Events.ERROR_OCCURRED, "Game has already started.");

			/* Add the player to the game */
			PlayerStore.add(socket.id, game_id, nickname);

			/* Add the player to the game room */
			let playerList = PlayerStore.all(game_id);
			socket.game_id = game_id;
			socket.join(game_id); // skipcq: JS-D008

			/* Broadcast the player list to all clients in the current game */
			io.to(game_id).emit(Events.UPDATE_PLAYER_LIST, playerList);

			/* Increment player count */
			GameStore.incrementPlayerCount(game_id);

			/* Send over all the players that are in a voice call */
			let playersInVoice = GameStore.getPlayersInVoice(game_id);
			socket.emit(Events.PLAYERS_IN_VOICE, playersInVoice);

			/* Broadcast a successful join to the connecting player */
			socket.emit(Events.PLAYER_JOIN_SUCCESS);
		} else {
			io.to(game_id).emit(Events.GAME_NOT_FOUND);
		}
	};

	/**
	 * Handle players leaving a game or disconnecting from the server
	 * @param {Object} io IO instance from socket.io
	 * @param {Object} socket Socket instance from the current connection
	 */
	leaveHandle = async (io, socket) => {
		/* Check if the player is the host */
		if (socket.game_id && GameStore.isHost(socket.game_id, socket.id)) {
			/* Remove host from the game, broadcast to host leaving to all clients in game */
			let { game_id } = GameStore.getGameByHost(socket.id);
			io.to(game_id).emit(Events.HOST_DISCONNECT);

			/* Remove all players from the game */
			PlayerStore.removeAll(game_id);
			GameStore.remove(game_id);

			/* Leave the current game room */
			socket.game_id = null;
			socket.leave(game_id);

			/* Broadcast game removal to all clients in game */
			io.sockets.emit(Events.GAME_REMOVED, game_id);
		} else {
			/* Remove player from the game, broadcast updated player list to all clients in game*/
			let { game_id } = PlayerStore.find(socket.id).player;

			/* Remove the player from the game */
			PlayerStore.remove(socket.id);

			/* Decrement player count */
			GameStore.decrementPlayerCount(game_id);

			/* Broadcast the updated player list to all clients in the current game */
			let remainingPlayers = PlayerStore.all(game_id);
			io.to(game_id).emit(Events.UPDATE_PLAYER_LIST, remainingPlayers);

			/* Leave the current game room */
			socket.leave(game_id);
		}
	};

	/**
	 * Wrapper function for the leaveHandle function
	 * @param {Object} io IO instance from socket.io
	 * @param {Object} socket Socket instance from the current connection
	 * @param {*} _
	 */
	leave = async (io, socket, _) => {
		this.leaveHandle(io, socket);
	};

	/**
	 * General disconnect handler
	 * @param {Object} io IO instance from socket.io
	 * @param {Object} socket Socket instance from the current connection
	 * @param {*} _
	 */
	disconnect = async (io, socket, _) => {
		let inGames = PlayerStore.inGame(socket.id);
		if (inGames) this.leaveHandle(io, socket);
	};
}

module.exports = GameHandler;
