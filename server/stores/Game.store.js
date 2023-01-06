const { randomString } = require('../helpers/Utility');

class GameStore {
	constructor() {
		this.games = []
	}

	createGame(gameName, hostSocketId, players_allowed) {
		let gameId = randomString(8);

		let currentGame = {
			game_id: gameId,
			game_name: gameName,
			host_socket_id: hostSocketId,
			players: 0,
			players_allowed: players_allowed,
			mode: 'scramble',
			started: false,
		}

		this.games.push(currentGame);

		return currentGame;
	}

	gameExists(gameId) {
		return this.games.some(game => game.game_id === gameId);
	}

	getGameByHostId(hostSocketId) {
		return this.games.find((game) => game.host_socket_id === hostSocketId);
	}

	getGameById(gameId) {
		let fetchGame = this.games.filter((game) => game.game_id === gameId);

		return (fetchGame.length > 0 ? fetchGame[0] : false);
	}

	getGameAmount(amount) {
		return this.games.slice(0, amount);
	}

	getPlayerCount(gameId) {
		let currentIndex = this.games.findIndex((game) => game.game_id === gameId);

		return {
			current: this.games[currentIndex].players,
			allowed: this.games[currentIndex].players_allowed,
		}
	}

	toggleGameStarted(gameId) {
		let currentIndex = this.games.findIndex((game) => game.game_id === gameId);

		return this.games[currentIndex].started = !this.games[currentIndex].started;
	}

	incrementPlayerCount(gameId) {
		let currentIndex = this.games.findIndex((game) => game.game_id === gameId);

		return this.games[currentIndex].players++;
	}

	isGameStarted(gameId) {
		let currentIndex = this.games.findIndex((game) => game.game_id === gameId);

		return this.games[currentIndex].started;
	}

	isGameHost(socketId) {
		return this.games.some(game => game.host_socket_id === socketId);
	}

	isHostingGame(socketId, gameId) {
		return this.games.some(game => game.host_socket_id === socketId && game.game_id === gameId);
	}

	removeGame(gameId) {
		return this.games = this.games.filter((game) => game.game_id != gameId);
	}
}

module.exports = new GameStore();