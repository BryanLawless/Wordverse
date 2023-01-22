const Events = require('../Events');
const Config = require('../../config/Config');
const Validation = require('../../helpers/Validate');
const GameStore = require('../../stores/Game.store');
const PlayerStore = require('../../stores/Player.store');
const ValidationSchemas = require('../../schemas/Validation.schema');

/*const twilio = require('twilio')(Config.VOICE.TWILIO_ACCOUNT_SID, Config.VOICE.TWILIO_AUTH_TOKEN, {
	lazyLoading: true
});*/

const GameModeLookup = {
	'scramble': require('./Scramble.handler'),
};

class GameHandler {

	create = async (io, socket, data) => {
		const { status, error } = Validation.Validate(data, ValidationSchemas.gateway.createGame);
		if (!status) return socket.emit(Events.ERROR_OCCURED, error);

		let { game_name, players_allowed } = data;
		let currentGame = GameStore.createGame(game_name, socket.id, players_allowed);

		socket.join(currentGame.game_id);

		return io.sockets.emit(Events.GAME_CREATED, currentGame);
	}

	start = async (io, socket, data) => {
		const { status, error } = Validation.Validate(data, ValidationSchemas.gateway.startGame);
		if (!status) return socket.emit(Events.ERROR_OCCURED, error);

		let { game_id } = data;
		if (!GameStore.isHostingGame(socket.id, game_id)) {
			return socket.emit(Events.ERROR_OCCURED, 'You are not the host of this game.');
		}

		let currentGame = GameStore.getGameById(game_id);
		let playersInGame = PlayerStore.getPlayers(game_id);
		if (currentGame.length <= 0) {
			return socket.emit(Events.ERROR_OCCURED, 'Game does not exist.');
		}

		if (playersInGame.length <= 1) {
			return socket.emit(Events.ERROR_OCCURED, 'Not enough players to start game.');
		}

		GameStore.toggleGameStarted(game_id);

		io.to(game_id).emit(Events.GAME_STARTING);

		let modeInstance = new GameModeLookup[currentGame.mode](io, socket);
		modeInstance.init();
	}

	join = async (io, socket, data) => {
		const { status, error } = Validation.Validate(data, ValidationSchemas.gateway.joinGame);
		if (!status) return socket.emit(Events.ERROR_OCCURED, error);

		let { game_id, nickname } = data;

		if (GameStore.gameExists(game_id)) {
			let { current, allowed } = GameStore.getPlayerCount(game_id);
			if (PlayerStore.nicknameExistsInGame(nickname, game_id)) {
				return socket.emit(Events.ERROR_OCCURED, 'Nickname already exists in game.');
			}

			if (current == allowed) return socket.emit(Events.ERROR_OCCURED, 'Game is full.');
			if (GameStore.isGameStarted(game_id)) return socket.emit(Events.ERROR_OCCURED, 'Game has already started.');

			PlayerStore.addPlayer(socket.id, game_id, nickname);

			let playerList = PlayerStore.getPlayers(game_id);
			socket.join(game_id);

			GameStore.incrementPlayerCount(game_id);

			if (playerList.length == 1) io.to(game_id).emit(Events.INITIATE_VOICE_CALL);

			io.to(game_id).emit(Events.UPDATE_PLAYER_LIST, playerList);

			socket.emit(Events.PLAYER_JOIN_SUCCESS);
		} else {
			io.to(game_id).emit(Events.GAME_NOT_FOUND);
		}
	}

	leaveHandle = async (io, socket) => {
		if (GameStore.isGameHost(socket.id)) {
			let { game_id } = GameStore.getGameByHostId(socket.id);
			io.to(game_id).emit(Events.HOST_DISCONNECT);

			PlayerStore.removePlayers(game_id);
			GameStore.removeGame(game_id);
			socket.leave(game_id);

			io.sockets.emit(Events.GAME_REMOVED, game_id);
		} else {
			let { game_id } = PlayerStore.getPlayer(socket.id);

			//GameStore.decrementPlayerCount(game_id);
			PlayerStore.removePlayer(socket.id);

			let remaingingPlayers = PlayerStore.getPlayers(game_id);
			io.to(game_id).emit(Events.UPDATE_PLAYER_LIST, remaingingPlayers);

			socket.leave(game_id);
		}
	}

	leave = async (io, socket, _) => {
		this.leaveHandle(io, socket);
	}

	disconnect = async (io, socket, _) => {
		if (PlayerStore.playerInGame(socket.id)) {
			this.leaveHandle(io, socket);
		}
	}
}

module.exports = GameHandler;