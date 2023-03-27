class MadlibsHandler {
	constructor(io, hostSocket) {
		this.io = io;
		this.gameId = "";
		this.hostSocket = hostSocket;

		this.events = {};
	}

	init() {
		console.log("MadlibsHandler initialized")
	}
}