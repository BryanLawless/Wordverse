import twilio from 'twilio';
import { Server } from 'socket.io';
import { VOICE } from '../../config/config.js';
import validate from '../../util/validate.js';
import GameStore from '../../stores/game.store.js';
import PlayerStore from '../../stores/player.store.js';
import { generateVoicePayload } from '../common/core.js';
import { SocketExtended } from '../../types/extend.types.js';
import gatewayValidation from '../../validation/gateway.validation.js';
import {
	ERROR_OCCURRED,
	RECEIVE_MESSAGE,
	VOICE_TOKEN,
	ADDING_TO_VOICE,
	REMOVING_FROM_VOICE
} from '../events.js';

/* Setup Twilio for STUN/TURN server */
const twilioInstance = twilio(
	VOICE.TWILIO_ACCOUNT_SID,
	VOICE.TWILIO_AUTH_TOKEN,
	{
		lazyLoading: true
	}
);

/* Setup Twilio credential payload */
let VoicePayload: any;
(async () => {
	VoicePayload = await generateVoicePayload(twilioInstance);
})();

class ChatHandler {
	/**
	 * Send a message to everyone in the game room
	 * @param {Server} io IO instance from socket.io
	 * @param {SocketExtended} socket Socket instance from current connection
	 * @param {Any} data Data sent from client
	 */
	static sendMessage(io: Server, socket: SocketExtended, data: any) {
		/* Validate the incoming data */
		const { status, error } = validate(data, gatewayValidation.sendMessage);
		if (!status) return socket.emit(ERROR_OCCURRED, error);

		/* Get the current player */
		let player = PlayerStore.find(socket.id).player;
		if (!player) return socket.emit(ERROR_OCCURRED, 'Invalid sender.');

		/* Send the message to the room */
		io.to(player.game_id).emit(RECEIVE_MESSAGE, {
			from: player.nickname,
			message: data.message
		});
	}

	/**
	 * Send a message to a game room as server
	 * @param {Server} io IO instance from socket.io
	 * @param {string} gameId The game id to send the message to
	 * @param {string} message The message to send
	 */
	static sendMessageAsServer(io: Server, gameId: string, message: string) {
		io.to(gameId).emit(RECEIVE_MESSAGE, {
			from: '[Server]',
			message: message
		});
	}

	/**
	 * Join the voice channel in a specific game
	 * @param {Server} io IO instance from socket.io
	 * @param {SocketExtended} socket Socket instance from current connection
	 */
	static joinVoice(io: Server, socket: SocketExtended) {
		/* Get player by socket id */
		const player = PlayerStore.find(socket.id).player;
		if (!player) return socket.emit(ERROR_OCCURRED, 'Could not join voice.');

		/* Check if player is already in voice */
		let currentGame = GameStore.find(player.game_id);
		if (currentGame.game.players_in_voice.includes(socket.id))
			return socket.emit(ERROR_OCCURRED, 'Already in voice.');

		/* Add player to voice */
		GameStore.addPlayerToVoice(player.game_id, socket.id);

		/* Send the Twilio payload to the client */
		socket.emit(VOICE_TOKEN, VoicePayload);

		/* Broadcast joining voice to all players in the game */
		io.to(player.game_id).emit(ADDING_TO_VOICE, socket.id);
	}

	/**
	 * Leave the voice channel of a specific game
	 * @param {Server} io IO instance from socket.io
	 * @param {SocketExtended} socket Socket instance from current connection
	 */
	static leaveVoice(io: Server, socket: SocketExtended) {
		/* Get player by socket id */
		const player = PlayerStore.find(socket.id).player;
		if (!player) return;

		/* Remove player from voice */
		GameStore.removePlayerFromVoice(player.game_id, socket.id);

		/* Broadcast leaving voice to all players in the game */
		io.to(player.game_id).emit(REMOVING_FROM_VOICE, socket.id);
	}
}

export default ChatHandler;
