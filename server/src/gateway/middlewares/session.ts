import { NextFunction } from 'express';
import { randomString } from '../../util/util.js';
import PlayerStore from '../../stores/player.store.js';
import { SocketExtended } from '../../types/extend.types.js';

/**
 * TODO: Middleware for persistent sessions
 * @param {SocketExtended} socket The current socket session
 * @param {NextFunction} next Callback to continue the program flow
 */
export default async function persistentSession(
	socket: SocketExtended,
	next: NextFunction
) {
	const playerSession = socket.handshake.auth.sessionID;
	if (playerSession) {
		const session = PlayerStore.find(playerSession);
		if (session) {
			socket.player_id = session.player.player_socket;
			socket.player_session = playerSession;

			return next();
		}
	}

	socket.player_id = randomString(12);
	socket.player_session = randomString(24);

	next();
}
