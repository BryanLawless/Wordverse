import { Server } from 'socket.io';
import { Server as httpServer } from 'http';
import { CLIENT_URL } from '../config/config.js';
import generalRoutes from './router/general.routes.js';
import { SocketExtended } from '../types/extend.types.js';

/**
 * Create a new websocket server from the HTTP server instance
 * @param {httpServer} server The HTTP server instance
 */
function registerSocketServer(server: httpServer) {
	/* Create a new websocket server */
	const io = new Server(server, {
		cors: {
			origin: CLIENT_URL,
			methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS']
		},
		allowEIO3: true,
		transports: ['polling', 'websocket']
	});

	/* Register all socket routes upon connection */
	io.on('connection', (socket) => {
		// skipcq: JS-D008
		generalRoutes.map((route) => {
			socket.on(route.name, (data) => {
				route.controller(io, socket as SocketExtended, data);
			});
		});
	});
}

export default registerSocketServer;
