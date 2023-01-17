const socketRoutes = require('./Routes');
const config = require('../config/Config');

function registerSocketServer(server) {
	const io = require('socket.io')(server, {
		cors: {
			origin: config.CLIENT_URL,
			methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
		},
		transport: ['websocket']
	});

	io.on('connection', (socket) => {
		socketRoutes.map((route) => {
			socket.on(route.name, (data) => {
				route.controller(io, socket, data)
			});
		});
	});
}

module.exports = {
	registerSocketServer,
}