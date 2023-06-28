import { Server } from 'socket.io';
import validate from '../../util/validate.js';
import GameStore from '../../stores/game.store.js';
import PlayerStore from '../../stores/player.store.js';
import gatewayValidation from '../../validation/gateway.validation.js';
import PictionaryHandler from './pictionary.handler.js';
import ScrambleHandler from './scramble.handler.js';
import { SocketExtended } from '../../types/extend.types.js';
import {
	ERROR_OCCURRED,
	GAME_CREATED,
	GAME_STARTING,
	UPDATE_PLAYER_LIST,
	PLAYERS_IN_VOICE,
	PLAYER_JOIN_SUCCESS,
	GAME_NOT_FOUND,
	HOST_DISCONNECT,
	GAME_REMOVED
} from '../events.js';

const GameModeLookup = {
	scramble: ScrambleHandler,
	pictionary: PictionaryHandler
};

class GameHandler {
	/**
	 * Create a game and add it to the GameStore
	 * @param {Server} io IO instance from socket.io
	 * @param {SocketExtended} socket Socket instance from the current connection
	 * @param {any} data Data sent from the client
	 */
	static async create(io: Server, socket: SocketExtended, data: any) {
		/* Validate the incoming data */
		const { status, error } = validate(data, gatewayValidation.createGame);

		if (!status) {
			return socket.emit(ERROR_OCCURRED, error);
		}

		/* Get the game name and players allowed, then create the game */
		const { game_name, players_allowed } = data;
		const currentGame = GameStore.add(game_name, socket.id, players_allowed);

		/* Add the player to the game room */
		socket.game_id = currentGame.game_id;
		socket.join(currentGame.game_id);

		/* Broadcast game creation to all clients */
		io.sockets.emit(GAME_CREATED, currentGame);
	}

	/**
	 * Start the current game if the player is the host
	 * @param {Server} io IO instance from socket.io
	 * @param {SocketExtended} socket Socket instance from the current connection
	 * @param {any} data Data sent from the client
	 */
	static async start(io: Server, socket: SocketExtended, data: any) {
		/* Validate the incoming data */
		const { status, error } = validate(data, gatewayValidation.startGame);
		if (!status) {
			return socket.emit(ERROR_OCCURRED, error);
		}

		/* Get the game ID, then check if the player is the host */
		const { game_id, game_mode } = data;
		if (!GameStore.isHost(game_id, socket.id)) {
			return socket.emit(ERROR_OCCURRED, 'You are not the host of this game.');
		}

		/* Check if the game exists and if there are enough players to start */
		const currentGame = GameStore.find(game_id)?.game;
		const playersInGame = PlayerStore.all(game_id);

		if (!currentGame) {
			return socket.emit(ERROR_OCCURRED, 'Game does not exist.');
		}

		if (!GameModeLookup.hasOwnProperty(game_mode)) {
			return socket.emit(ERROR_OCCURRED, 'Invalid game mode.');
		}

		if (playersInGame.length <= 1) {
			return socket.emit(
				ERROR_OCCURRED,
				'Not enough players to start the game.'
			);
		}

		const setCurrentGameMode = GameStore.set(game_id, 'mode', game_mode);

		/* Start the game, toggle the status */
		GameStore.toggleGameStarted(game_id);

		/* Broadcast game start to all clients */
		io.to(game_id).emit(GAME_STARTING, currentGame);

		/* Start the requested game mode */
		const modeInstance = new GameModeLookup[setCurrentGameMode](io, socket);
		modeInstance.init();
	}

	/**
	 * Join a game if it exists and there is space for another player
	 * @param {Server} io IO instance from socket.io
	 * @param {SocketExtended} socket Socket instance from the current connection
	 * @param {any} data Data sent from the client
	 */
	static async join(io: Server, socket: SocketExtended, data: any) {
		/* Validate the incoming data */
		const { status, error } = validate(data, gatewayValidation.joinGame);
		if (!status) {
			return socket.emit(ERROR_OCCURRED, error);
		}

		/* Get the game ID and nickname, then check if the game exists */
		const { game_id, nickname } = data;
		if (!GameStore.gameExists(game_id)) {
			io.to(game_id).emit(GAME_NOT_FOUND);
			return;
		}

		if (nickname.includes('[Server]')) {
			return socket.emit(ERROR_OCCURRED, 'Invalid nickname.');
		}

		/* Check if the game is full, and if it has already started */
		const playerCount = GameStore.getPlayerCount(game_id);
		if (playerCount.current === playerCount.allowed) {
			return socket.emit(ERROR_OCCURRED, 'Game is full.');
		}
		if (GameStore.get(game_id, 'started')) {
			return socket.emit(ERROR_OCCURRED, 'Game has already started.');
		}

		/* Add the player to the game */
		PlayerStore.add(socket.id, game_id, nickname);

		/* Add the player to the game room */
		const playerList = PlayerStore.all(game_id);
		socket.game_id = game_id;
		socket.join(game_id);

		/* Broadcast the player list to all clients in the current game */
		io.to(game_id).emit(UPDATE_PLAYER_LIST, playerList);

		/* Increment player count */
		GameStore.incrementPlayerCount(game_id);

		/* Send over all the players that are in a voice call */
		const playersInVoice = GameStore.getPlayersInVoice(game_id);
		socket.emit(PLAYERS_IN_VOICE, playersInVoice);

		/* Broadcast a successful join to the connecting player */
		socket.emit(PLAYER_JOIN_SUCCESS);
	}

	/**
	 * Handle players leaving a game or disconnecting from the server
	 * @param {Server} io IO instance from socket.io
	 * @param {SocketExtended} socket Socket instance from the current connection
	 */
	static async leaveHandle(io: Server, socket: SocketExtended) {
		/* Check if the player is the host */
		if (socket.game_id && GameStore.isHost(socket.game_id, socket.id)) {
			/* Remove host from the game, broadcast to host leaving to all clients in the game */
			const { game_id } = GameStore.getGameByHost(socket.id);
			io.to(game_id).emit(HOST_DISCONNECT);

			/* Remove all players from the game */
			PlayerStore.removeAll(game_id);

			/* Cancel and remove all timers from the game */
			GameStore.removeAllGameTimers(game_id);

			/* Remove the game itself */
			GameStore.remove(game_id);

			/* Leave the current game room */
			socket.game_id = null;
			socket.leave(game_id);

			/* Broadcast game removal to all clients in the game */
			io.sockets.emit(GAME_REMOVED, game_id);
		} else {
			/* Remove player from the game, broadcast updated player list to all clients in the game */
			const { game_id } = PlayerStore.find(socket.id).player;

			/* Cancel and remove all pending timers for the player */
			GameStore.removeTimerByPlayer(game_id, socket.id);

			/* Remove the player from the game */
			PlayerStore.remove(socket.id);

			/* Decrement player count */
			GameStore.decrementPlayerCount(game_id);

			/* Broadcast the updated player list to all clients in the current game */
			const remainingPlayers = PlayerStore.all(game_id);
			io.to(game_id).emit(UPDATE_PLAYER_LIST, remainingPlayers);

			/* Leave the current game room */
			socket.leave(game_id);
		}
	}

	/**
	 * General disconnect handler
	 * @param {Server} io IO instance from socket.io
	 * @param {SocketExtended} socket Socket instance from the current connection
	 */
	static async leave(io: Server, socket: SocketExtended) {
		const inGames = PlayerStore.inGame(socket.id);
		if (inGames) await GameHandler.leaveHandle(io, socket);
	}
}

export default GameHandler;
