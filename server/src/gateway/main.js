const config = require("../config/Config");
const socketRoutes = require("./router/general.routes");

/**
 * Create a new websocket server from the HTTP server instance
 * @param {Object} server The HTTP server instance
 */
function registerSocketServer(server) {
	/* Create a new websocket server */
	const io = require("socket.io")(server, {
		cors: {
			origin: config.CLIENT_URL,
			methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"]
		},
		allowEIO3: true,
		transport: ["websocket"]
	});

	/* Register all socket routes upon connection */
	io.on("connection", (socket) => {
		// skipcq: JS-D008
		socketRoutes.map((route) => {
			socket.on(route.name, (data) => {
				route.controller(io, socket, data);
			});
		});
	});
}

module.exports = {
	registerSocketServer
};
