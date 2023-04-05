class PlayerStore {
	constructor() {
		this.players = [];
	}

	/**
	 * Add a player to the store
	 * @param {String} playerSocket The current socket session of the player
	 * @param {String} gameId The current game id that they are joining
	 * @param {String} nickname The nickname of the player
	 * @returns {Object} The player object
	 */
	add(playerSocket, gameId, nickname) {
		let player = {
			player_socket: playerSocket,
			nickname: nickname,
			game_id: gameId,
			answer: "",
			score: 0,
			coins: 1000,
			effects: []
		};

		this.players.push(player);

		return player;
	}

	/**
	 * Get all players in a specific game
	 * @param {String} gameId The current game id to look in
	 * @returns {Array} List of players in a game
	 */
	all(gameId) {
		return this.players.filter((player) => player.game_id === gameId);
	}

	/**
	 * Get a specific key from a player object
	 * @param {String} playerSocket The current socket session of the player
	 * @param {String} key The key to get from the player object
	 * @returns {Any} The value of the key
	 */
	get(playerSocket, key) {
		let player = this.find(playerSocket);

		return player.index >= 0 ? player.player[key] : false;
	}

	/**
	 *
	 * @param {String} playerSocket The current socket session of the player
	 * @param {String} key The key to modify
	 * @param {Any} value The value to set the key to
	 * @returns {Any|Boolean} The value of the key or false if the player doesn't exist
	 */
	modify(playerSocket, key, value) {
		let player = this.find(playerSocket).index;

		return player >= 0 ? (this.players[player][key] = value) : false;
	}

	/**
	 * Get specific player object
	 * @param {String} playerSocket The current socket session of the player
	 * @returns {Object} The player object
	 */
	find(playerSocket) {
		let player = this.players.findIndex(
			(player) => player.player_socket === playerSocket
		);

		return {
			index: player,
			player: player >= 0 ? this.players[player] : false
		};
	}

	/**
	 * Check if a player is in a game
	 * @param {String} playerSocket The current socket session of the player
	 * @returns {String|Boolean} The game id or false if the is not in a game
	 */
	inGame(playerSocket) {
		let player = this.find(playerSocket).player;

		return player && typeof player.game_id === "string" && player.game_id.length
			? player.game_id
			: false;
	}

	/**
	 * Increment a specific key by a value
	 * @param {String} playerSocket The current socket session of the player
	 * @param {String} key The key to modify
	 * @param {Any} value The value to increment the key by
	 * @returns {Any|Boolean} The value of the key or false if the player doesn't exist
	 */
	incrementValueBy(playerSocket, key, value) {
		let player = this.find(playerSocket);

		return player.player ? (this.players[player.index][key] += value) : false;
	}

	/**
	 * Decrement a specific key by a value
	 * @param {String} playerSocket The current socket session of the player
	 * @param {String} key The key to modify
	 * @param {Any} value The value to decrement the key by
	 * @returns The value of the key or false if the player doesn't exist
	 */
	decrementValueBy(playerSocket, key, value) {
		let player = this.find(playerSocket);

		return player.player ? (this.players[player.index][key] -= value) : false;
	}

	/**
	 * Remove a player from the store
	 * @param {String} playerSocket The current socket session of the player
	 * @returns {Array|Boolean} The player object or false if the player doesn't exist
	 */
	remove(playerSocket) {
		this.players = this.players.filter(
			(player) => player.player_socket != playerSocket
		);
	}

	/**
	 * Remove all players from a game
	 * @param {String} gameId The current game id to look in
	 */
	removeAll(gameId) {
		let removePlayers = this.all(gameId);
		for (var i = 0; i < removePlayers.length; i++) {
			this.remove(removePlayers[i].player_socket);
		}
	}

	/**
	 * Add an effect to a player
	 * @param {String} socketId The current socket session of the player
	 * @param {String} effectName The name of the effect to add
	 */
	addEffect(socketId, effectName) {
		let player = this.find(socketId).index;

		if (this.players[player]) {
			this.players[player].effects.push(effectName);
		}
	}

	/**
	 * Remove a specific effect from a player
	 * @param {String} socketId The current socket session of the player
	 * @param {String} effectName The name of the effect to remove
	 */
	removeEffect(socketId, effectName) {
		let player = this.find(socketId).index;

		if (this.players[player]) {
			this.players[player].effects = this.players[player].effects.filter(
				(effect) => effect.name != effectName
			);
		}
	}
}

module.exports = new PlayerStore();
