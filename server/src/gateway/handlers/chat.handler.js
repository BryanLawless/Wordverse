const Events = require("../events");
const Core = require("../common/core");
const Config = require("../../config/config");
const Validation = require("../../helpers/validate");
const GameStore = require("../../stores/game.store");
const PlayerStore = require("../../stores/player.store");
const ValidationSchemas = require("../../schemas/validation.schema");

/* Setup Twilio for STUN/TURN server */
const twilio = require('twilio')(Config.VOICE.TWILIO_ACCOUNT_SID, Config.VOICE.TWILIO_AUTH_TOKEN, {
	lazyLoading: true
});

/* Setup Twilio credential payload */
let VoicePayload;
(async () => {
	VoicePayload = await Core.generateVoicePayload(twilio);
})();

class ChatHandler {
	/**
	 * Send a message to everyone in the game room
	 * @param {Object} io IO instance from socket.io
	 * @param {*} socket Socket instance from current connection
	 * @param {*} data Data sent from client
	 */
	sendMessage(io, socket, data) {
		/* Validate the incoming data */
		const { status, error } = Validation.Validate(
			data,
			ValidationSchemas.gateway.sendMessage
		);
		if (!status) return socket.emit(Events.ERROR_OCCURRED, error);

		/* Get the current player */
		let player = PlayerStore.find(socket.id).player;
		if (!player) return socket.emit(Events.ERROR_OCCURRED, "Invalid sender.");

		/* Send the message to the room */
		io.to(player.game_id).emit(Events.RECEIVE_MESSAGE, {
			from: player.nickname,
			message: data.message
		});
	}

	/**
	 * Join the voice channel in a specific game
	 * @param {Object} io IO instance from socket.io
	 * @param {Object} socket Socket instance from current connection
	 * @param {Object} data Data sent from client
	 */
	joinVoice(io, socket, data) {
		/* Get player by socket id */
		const player = PlayerStore.find(socket.id).player;
		if (!player) return socket.emit(Events.ERROR_OCCURRED, "Could not join voice.");

		/* Check if player is already in voice */
		let currentGame = GameStore.find(player.game_id);
		if (currentGame.game.players_in_voice.includes(socket.id)) return socket.emit(Events.ERROR_OCCURRED, "Already in voice.");

		/* Add player to voice */
		GameStore.addPlayerToVoice(player.game_id, socket.id);

		/* Send the Twilio payload to the client */
		socket.emit(Events.VOICE_TOKEN, VoicePayload);

		/* Broadcast joining voice to all players in the game */
		io.to(player.game_id).emit(Events.ADDING_TO_VOICE, socket.id);
	}

	/**
	 * Leave the voice channel of a specific game
	 * @param {Object} io IO instance from socket.io
	 * @param {Object} socket Socket instance from current connection
	 * @param {Object} data Data sent from client
	 */
	leaveVoice(io, socket, data) {
		/* Get player by socket id */
		const player = PlayerStore.find(socket.id).player;
		if (!player) return;

		/* Remove player from voice */
		GameStore.removePlayerFromVoice(player.game_id, socket.id);

		/* Broadcast leaving voice to all players in the game */
		io.to(player.game_id).emit(Events.REMOVING_FROM_VOICE, socket.id);
	}
}

module.exports = ChatHandler;