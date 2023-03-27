const PlayerStore = require("../../stores/player.store");
const { randomString } = require("../../helpers/utility");

/**
 * TODO: Middleware for persistent sessions
 * @param {Object} socket The current socket session
 * @param {Function} next Callback to continue the program flow
 */
const persistentSession = async (socket, next) => {
	const playerSession = socket.handshake.auth.sessionID;
	if (playerSession) {
		const session = await PlayerStore.find(playerSession);
		if (session) {
			socket.player_id = session.player_id;
			socket.player_session = playerSession;

			return next();
		}
	}

	socket.player_id = randomString(12);
	socket.player_session = randomString(24);

	next();
};

module.exports = {
	persistentSession: persistentSession
};
