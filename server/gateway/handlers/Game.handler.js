const Events = require('../Events');
const Validation = require('../../helpers/Validate');
const GameStore = require('../../stores/Game.store');
const PlayerStore = require('../../stores/Player.store');
const ValidationSchemas = require('../../schemas/Validation.schema');

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

			PlayerStore.addPlayer(socket.id, game_id, nickname);

			let playerList = PlayerStore.getPlayers(game_id);
			socket.join(game_id);

			GameStore.incrementPlayerCount(game_id);

			io.to(game_id).emit(Events.UPDATE_PLAYER_LIST, playerList);

			socket.emit(Events.PLAYER_JOIN_SUCCESS);
		} else {
			io.to(game_id).emit(Events.GAME_NOT_FOUND);
		}
	}

	leaveHandle = async (io, socket) => {
		if (GameStore.isGameHost(socket.id)) {
			let hostGame = GameStore.getGameByHostId(socket.id);
			io.to(hostGame.game_id).emit(Events.HOST_DISCONNECT);

			PlayerStore.removePlayers(hostGame.game_id);
			GameStore.removeGame(hostGame.game_id);
			socket.leave(hostGame.game_id);

			io.sockets.emit(Events.GAME_REMOVED, hostGame.game_id);
		} else {
			let playerDisconnect = PlayerStore.getPlayer(socket.id);
			PlayerStore.removePlayer(socket.id);

			let remaingingPlayers = PlayerStore.getPlayers(playerDisconnect.game_id);
			io.to(playerDisconnect.game_id).emit(Events.UPDATE_PLAYER_LIST, remaingingPlayers);

			socket.leave(playerDisconnect.game_id);
		}
	}

	leave = async (io, socket, data) => {
		this.leaveHandle(io, socket)
	}

	disconnect = async (io, socket, data) => {
		if (PlayerStore.playerInGame(socket.id)) {
			this.leaveHandle(io, socket);
		}
	}
}

module.exports = GameHandler;