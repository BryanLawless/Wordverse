import { Player, PlayerFound } from '../types/player.types.js';

class PlayerStore {
	players: Array<Player>;

	constructor() {
		this.players = [];
	}

	/**
	 * Add a player to the store
	 * @param {string} playerSocket The current socket session of the player
	 * @param {string} gameId The current game id that they are joining
	 * @param {string} nickname The nickname of the player
	 * @returns {Player} The newly added player
	 */
	add(playerSocket: string, gameId: string, nickname: string): Player {
		let player: Player = {
			player_socket: playerSocket,
			nickname: nickname,
			game_id: gameId,
			answer: '',
			score: 0,
			coins: 999,
			effects: [],
			turn: false,
			choosing: false,
			correct_guess: false
		};

		this.players.push(player);

		return player;
	}

	/**
	 * Get all players in a specific game
	 * @param {string} gameId The current game id to look in
	 * @returns {array} List of players in a game
	 */
	all(gameId: string): Array<any> {
		return this.players.filter((player) => player.game_id === gameId);
	}

	/**
	 *
	 * @param {string} playerSocket The current socket session of the player
	 * @param {string} key The key to modify
	 * @param {any} value The value to set the key to
	 * @returns {any|boolean} The value of the key or false if the player doesn't exist
	 */
	modify(playerSocket: string, key: string, value: any): any | boolean {
		let player = this.find(playerSocket).index;

		return player >= 0 ? (this.players[player][key] = value) : false;
	}

	/**
	 * Get specific player object
	 * @param {string} playerSocket The current socket session of the player
	 * @returns {PlayerFound} The player object
	 */
	find(playerSocket: string): PlayerFound {
		let player = this.players.findIndex(
			(p) => p.player_socket === playerSocket
		);

		return {
			index: player,
			player: this.players[player]
		};
	}

	/**
	 * Check if a player is in a game
	 * @param {string} playerSocket The current socket session of the player
	 * @returns {string|boolean} The game id or false if the is not in a game
	 */
	inGame(playerSocket: string): string | boolean {
		let player = this.find(playerSocket).player;

		return player && typeof player.game_id === 'string' && player.game_id.length
			? player.game_id
			: false;
	}

	/**
	 * See if a player is currently on their turn
	 * @param {string} playerSocket The current socket session of the player
	 * @returns {boolean} True if the player is choosing a word
	 */
	isTurn(playerSocket: string): boolean {
		let player = this.find(playerSocket).player;

		return player && typeof player.turn === 'boolean' ? player.turn : false;
	}

	/**
	 * Increment a specific key by a value
	 * @param {string} playerSocket The current socket session of the player
	 * @param {string} key The key to modify
	 * @param {any} value The value to increment the key by
	 * @returns {any|boolean} The value of the key or false if the player doesn't exist
	 */
	incrementValueBy(
		playerSocket: string,
		key: string,
		value: any
	): any | boolean {
		let player = this.find(playerSocket);

		return player.player ? (this.players[player.index][key] += value) : false;
	}

	/**
	 * Decrement a specific key by a value
	 * @param {string} playerSocket The current socket session of the player
	 * @param {string} key The key to modify
	 * @param {any} value The value to decrement the key by
	 * @returns {any|boolean} The value of the key or false if the player doesn't exist
	 */
	decrementValueBy(
		playerSocket: string,
		key: string,
		value: any
	): any | boolean {
		let player = this.find(playerSocket);

		return player.player ? (this.players[player.index][key] -= value) : false;
	}

	/**
	 * Remove a player from the store
	 * @param {string} playerSocket The current socket session of the player
	 */
	remove(playerSocket: string): void {
		this.players = this.players.filter(
			(player) => player.player_socket != playerSocket
		);
	}

	/**
	 * Remove all players from a game
	 * @param {string} gameId The current game id to look in
	 */
	removeAll(gameId: string) {
		let removePlayers = this.all(gameId);
		for (var i = 0; i < removePlayers.length; i++) {
			this.remove(removePlayers[i].player_socket);
		}
	}

	/**
	 * Add an effect to a player
	 * @param {string} socketId The current socket session of the player
	 * @param {string} effectName The name of the effect to add
	 */
	addEffect(socketId: string, effectName: string) {
		let player = this.find(socketId).index;

		if (this.players[player]) {
			this.players[player].effects.push(effectName);
		}
	}

	/**
	 * Remove a specific effect from a player
	 * @param {string} socketId The current socket session of the player
	 * @param {string} effectName The name of the effect to remove
	 */
	removeEffect(socketId: string, effectName: string): void {
		let player = this.find(socketId).index;

		if (this.players[player]) {
			this.players[player].effects = this.players[player].effects.filter(
				(effect) => effect != effectName
			);
		}
	}

	/**
	 * Toggle the choosing word state of a player
	 * @param {string} socketId The current socket session of the player
	 */
	toggleChoosing(socketId: string): void {
		let player = this.find(socketId).index;

		if (this.players[player]) {
			this.players[player].choosing = !this.players[player].choosing;
		}
	}

	/**
	 * Toggle the turn state of a player
	 * @param {string} socketId The current socket session of the player
	 */
	toggleTurn(socketId: string) {
		let player = this.find(socketId).index;

		if (this.players[player])
			this.players[player].turn = !this.players[player].turn;
	}

	/**
	 * Check if all players have guessed correctly
	 * @param gameId The current game id to look in
	 * @returns {boolean} True if all players have guessed correctly
	 */
	allGuessedCorrectly(gameId: string): boolean {
		let players = this.all(gameId).filter((player) => !player.turn);

		for (var i = 0; i < players.length; i++) {
			if (!players[i].correct_guess) return false;
		}

		return true;
	}

	/**
	 * Reset all players correct guess state
	 * @param gameId The current game id to look in
	 */
	resetAllCorrectGuesses(gameId: string) {
		let players = this.all(gameId);
		for (var i = 0; i < players.length; i++) {
			this.players[i].correct_guess = false;
		}
	}
}

export default new PlayerStore();
