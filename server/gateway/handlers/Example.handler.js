class GameModeHandler {
	constructor(io, hostSocket) {
		this.io = io;
		this.gameId = '';
		this.hostSocket = hostSocket;

		this.name = 'gamemode';
		this.time = 120;
		this.tutorial = [];

		/*this.events = {
			["EVENT_NAME"]: CallbackFunction,
		};*/
	}

	init = async () => {
		const sockets = await this.io.in(this.gameId).fetchSockets();
		for (let socket of sockets) {
			for (let [event, callback] of Object.entries(this.events)) {
				if (typeof variable === 'undefined' || variable === null) socket.on(event, (data) => callback(socket, data));
			}
		}
	}
}