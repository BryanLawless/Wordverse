const { randomString } = require("../helpers/utility");

class GameStore {
	constructor() {
		this.games = [];
	}

	/**
	 * Create a new game
	 * @param {String} gameName The name of the game
	 * @param {String} hostSocket The current socket session of the host
	 * @param {Int} players_allowed The amount of players allowed in the game
	 * @returns {Object} The game object
	 */
	add(gameName, hostSocket, players_allowed) {
		let gameId = randomString(8);

		let currentGame = {
			game_id: gameId,
			game_name: gameName,
			host_socket: hostSocket,
			started: false,
			mode: "scramble",
			player_count: 0,
			players_allowed: players_allowed,
			players_in_voice: [],
		};

		this.games.push(currentGame);

		return currentGame;
	}

	/**
	 * Find a specific game by id
	 * @param {String} gameId The current game id to look in
	 * @returns {Object|Boolean} The game object or false if the game doesn't exist
	 */
	find(gameId) {
		let game = this.games.findIndex((game) => game.game_id === gameId);

		return {
			index: game,
			game: game >= 0 ? this.games[game] : false
		};
	}

	/**
	 * Check if a game exists
	 * @param {String} gameId The current game id to look in
	 * @returns {Boolean} True if the game exists, false if it doesn't
	 */
	gameExists(gameId) {
		return this.find(gameId).game !== false;
	}

	/**
	 * Modify a specific key in a game object
	 * @param {String} gameId The current game id to look in
	 * @param {String} key The key to modify
	 * @returns {Any|Boolean} The value of the key or false if the game doesn't exist
	 */
	get(gameId, key) {
		let game = this.find(gameId).game;

		return game ? game[key] : false;
	}

	/**
	 * Get the specified amount of games
	 * @param {Integer} amount The amount of games to return
	 * @returns {Array} List of games
	 */
	getAmount(amount) {
		return this.games.slice(0, amount);
	}

	/**
	 * Get a list of games with the possible host
	 * @param {String} hostSocket The current socket session of the host
	 * @returns {Array} List of games with the possible host
	 */
	getGameByHost(hostSocket) {
		return this.games.find((game) => game.host_socket === hostSocket);
	}

	/**
	 * Get the current and allowed player count from a game
	 * @param {String} gameId The current game id to look in
	 * @returns {Object: {current: Integer, allowed: Integer}} The current and allowed player count
	 */
	getPlayerCount(gameId) {
		let game = this.find(gameId).game;

		return {
			current: game.player_count,
			allowed: game.players_allowed
		};
	}

	/**
	 * Toggle the game started status
	 * @param {String} gameId The current game id to look in
	 * @returns {Boolean} The status of the game
	 */
	toggleGameStarted(gameId) {
		let game = this.find(gameId);

		return game
			? (this.games[game.index].started = !this.games[game.index].started)
			: false;
	}

	/**
	 * Check if the user is host of the game
	 * @param {String} gameId The current game id to look in
	 * @param {String} hostSocket The current socket session of the host
	 * @returns {Boolean} True if the user is host, false if it doesn't
	 */
	isHost(gameId, hostSocket) {
		let game = this.find(gameId).game;

		return game ? game.host_socket === hostSocket : false;
	}

	/**
	 * Increment the player count of a game
	 * @param {String} gameId The current game id to look in
	 * @returns {Object|Boolean} The game object or false if the game doesn't exist
	 */
	incrementPlayerCount(gameId) {
		let game = this.find(gameId);

		return game ? this.games[game.index].player_count++ : false;
	}

	/**
	 * Decrement the player count of a game
	 * @param {String} gameId The current game id to look in
	 * @returns {Object|Boolean} The game object or false if the game doesn't exist
	 */
	decrementPlayerCount(gameId) {
		try {
			let game = this.find(gameId);

			return game ? this.games[game.index].player_count-- : false;
		} catch (e) {
			return false;
		}
	}

	/**
	 * Get the list of players in voice for a specific game
	 * @param {String} gameId The current game id to look in
	 * @returns {Array|Boolean} The list of players in voice or false if the game doesn't exist
	 */
	getPlayersInVoice(gameId) {
		let game = this.find(gameId).game;

		return game ? game.players_in_voice : false;
	}

	/**
	 * Add a player to the list of players in voice
	 * @param {String} gameId The current game id for the voice channel
	 * @param {String} socketId The current socket id of the player
	 * @returns {Array|Boolean} The list of players in voice or false if the game doesn't exist
	 */
	addPlayerToVoice(gameId, socketId) {
		let game = this.find(gameId);

		return game ? this.games[game.index].players_in_voice.push(socketId) : false;
	}

	/**
	 * Remove a player from the list of players in voice
	 * @param {String} gameId The current game id for the voice channel
	 * @param {String} socketId The current socket id of the player
	 * @returns {Array|Boolean} The list of players in voice or false if the game doesn't exist
	 */
	removePlayerFromVoice(gameId, socketId) {
		let game = this.find(gameId);

		this.games[game.index].players_in_voice = this.games[game.index].players_in_voice.filter((player) => player !== socketId);

		return game ? this.games[game.index].players_in_voice : false;
	}

	/**
	 * Remove a game from the store
	 * @param {String} gameId The current game id to look in
	 * @returns {Array} Updated list of games
	 */
	remove(gameId) {
		return (this.games = this.games.filter((game) => game.game_id != gameId));
	}
}

module.exports = new GameStore();
