import { randomString } from '../util/util.js';
import { TimedPromise } from '../types/extend.types.js';
import { Game, GameFound, Line, PlayerCount } from '../types/game.types.js';

class GameStore {
	games: Array<Game>;

	constructor() {
		this.games = [];
	}

	/**
	 * Create a new game
	 * @param {string} gameName The name of the game
	 * @param {string} hostSocket The current socket session of the host
	 * @param {number} playersAllowed The amount of players allowed in the game
	 * @returns {Game} The game object
	 */
	add(gameName: string, hostSocket: string, playersAllowed: number): Game {
		const gameId = randomString(8);

		const currentGame: Game = {
			game_id: gameId,
			game_name: gameName,
			host_socket: hostSocket,
			started: false,
			mode: '',
			player_count: 0,
			players_allowed: playersAllowed,
			players_in_voice: [],
			lines: [],
			round: 0,
			currentTurn: 0,
			timers: []
		};

		this.games.push(currentGame);

		return currentGame;
	}

	/**
	 * Find a specific game by id
	 * @param {string} gameId The current game id to look for
	 * @returns {GameFound} The game object
	 */
	find(gameId: string): GameFound {
		const index = this.games.findIndex((game) => game.game_id === gameId);

		return {
			index,
			game: this.games[index]
		};
	}

	/**
	 * Check if a game exists
	 * @param {string} gameId The current game id to look for
	 * @returns {boolean} True if the game exists, false if it doesn't
	 */
	gameExists(gameId: string): boolean {
		return this.find(gameId).game !== undefined;
	}

	/**
	 * Get a specific key in a game object
	 * @param {string} gameId The current game id to look for
	 * @param {string} key The key to get
	 * @returns {any} The value of the key
	 */
	get(gameId: string, key: string): any {
		const game = this.find(gameId).game;

		return game ? game[key] : undefined;
	}

	/**
	 * Set a specific key in a game object
	 * @param {string} gameId The current game id to look for
	 * @param {string} key The key to modify
	 * @param {any} value The value to set
	 * @returns {any} The changed value
	 */
	set(gameId: string, key: string, value: any): any {
		const game = this.find(gameId).game;

		if (game) {
			game[key] = value;
			return game[key];
		}

		return undefined;
	}

	/**
	 * Get the specified amount of games
	 * @param {number} amount The amount of games to return
	 * @returns {Array<Game>} List of games
	 */
	getAmount(amount: number): Array<Game> {
		return this.games.slice(0, amount);
	}

	/**
	 * Get a list of games with the possible host
	 * @param {string} hostSocket The current socket session of the host
	 * @returns {Game} Returns a game if the specified host is found
	 */
	getGameByHost(hostSocket: string): Game {
		return this.games.filter((game) => game.host_socket === hostSocket)[0];
	}

	/**
	 * Get the current and allowed player count from a game
	 * @param {string} gameId The current game id to look for
	 * @returns {PlayerCount} The current and allowed player count
	 */
	getPlayerCount(gameId: string): PlayerCount {
		const game = this.find(gameId).game;

		return game
			? {
					current: game.player_count,
					allowed: game.players_allowed
			  }
			: undefined;
	}

	/**
	 * Get the index of the player with the next turn
	 * @param {string} gameId The current game id to look for
	 * @returns {number} The next possible turn player index
	 */
	getNextTurnPlayerIndex(gameId: string): number {
		const game = this.find(gameId).game;

		return game ? game.currentTurn++ % game.players_allowed : 0;
	}

	/**
	 * Toggle the game started status
	 * @param {string} gameId The current game id to look for
	 * @returns {boolean} The status of the game
	 */
	toggleGameStarted(gameId: string): boolean {
		const game = this.find(gameId).game;

		if (game) {
			game.started = !game.started;
			return game.started;
		}

		return false;
	}

	/**
	 * Check if the user is the host of the game
	 * @param {string} gameId The current game id to look for
	 * @param {string} hostSocket The current socket session of the host
	 * @returns {boolean} True if the user is the host, false if not
	 */
	isHost(gameId: string, hostSocket: string): boolean {
		const game = this.find(gameId).game;

		return game ? game.host_socket === hostSocket : false;
	}

	/**
	 * Increment the player count of a game
	 * @param {string} gameId The current game id to look for
	 * @returns {number|boolean} The incremented player count or false if the game doesn't exist
	 */
	incrementPlayerCount(gameId: string): number | boolean {
		const game = this.find(gameId);

		if (game.game) {
			game.game.player_count++;
			return game.game.player_count;
		}

		return false;
	}

	/**
	 * Decrement the player count of a game
	 * @param {string} gameId The current game id to look for
	 * @returns {number|boolean} The decremented player count or false if the game doesn't exist
	 */
	decrementPlayerCount(gameId: string): number | boolean {
		const game = this.find(gameId);

		if (game.game) {
			game.game.player_count--;
			return game.game.player_count;
		}

		return false;
	}

	/**
	 * Increment the round count of a game
	 * @param {string} gameId The current game id to look for
	 * @returns {number|boolean} The incremented round or false if the game doesn't exist
	 */
	incrementRound(gameId: string): number | boolean {
		const game = this.find(gameId);

		if (game.game) {
			game.game.round++;
			return game.game.round;
		}

		return false;
	}

	/**
	 * Add a line to a game
	 * @param {string} gameId The game id to add the line to
	 * @param {Line} line The corresponding line to add
	 */
	addLine(gameId: string, line: Line) {
		let game = this.find(gameId);

		if (game.index >= 0) this.games[game.index].lines.push(line);
	}

	/**
	 * Undo a line from a game
	 * @param {string} gameId The game id to undo the line from
	 * @param {number} amount The amount of the line to undo
	 */
	undoLine(gameId: string, amount: number = 15) {
		let game = this.find(gameId);

		if (game.index >= 0) this.games[game.index].lines.slice(0, -amount);
	}

	/**
	 * Get all the pending timers from a game
	 * @param {string} gameId The game id to get the timers from
	 * @returns {Array<Delay>|boolean} The list of timers or false if the game doesn't exist
	 */
	getTimers(gameId: string): Array<TimedPromise> | boolean {
		const game = this.find(gameId).game;

		return game ? game.timers : false;
	}

	/**
	 * Add a timer instance to a game
	 * @param {string} gameId The game id to add the timer to
	 * @param {Delay} timer The timer instance to add
	 */
	addTimer(gameId: string, timer: TimedPromise) {
		const game = this.find(gameId);

		if (game.index >= 0) this.games[game.index].timers.push(timer);
	}

	/**
	 * Cancel and remove a timer instance from a game
	 * @param {string} gameId The game id to remove the timer from
	 * @param {Delay} timer The timer instance to remove
	 */
	removeTimer(gameId: string, timer: TimedPromise) {
		const game = this.find(gameId);

		if (game.index >= 0) {
			const index = game.game.timers.indexOf(timer);

			if (index >= 0) {
				game.game.timers[index].cancelRejectPromise();
				game.game.timers.splice(index, 1);
			}
		}
	}

	/**
	 * Remove a timer instance from a game by the player socket id
	 * @param {string} gameId The game id to remove the timer from
	 * @param {string} socketId The socket id of the player that the timer belongs to
	 */
	removeTimerByPlayer(gameId: string, socketId: string) {
		const game = this.find(gameId);

		if (game.index >= 0) {
			for (let i = 0; i < game.game.timers.length; i++) {
				if (game.game.timers[i].belongs === socketId) {
					game.game.timers[i].cancelRejectPromise();
					game.game.timers.splice(i, 1);
					break;
				}
			}
		}
	}

	/**
	 * Cancel and remove all timer instances from a game
	 * @param {string} gameId The game id to remove all timers from
	 */
	removeAllGameTimers(gameId: string) {
		const game = this.find(gameId);

		if (game.index >= 0) {
			for (let i = 0; i < game.game.timers.length; i++)
				game.game.timers[i].cancelRejectPromise();

			this.games[game.index].timers = [];
		}
	}

	/**
	 * Get the list of players in voice for a specific game
	 * @param {string} gameId The current game id to look for
	 * @returns {array|boolean} The list of players in voice or false if the game doesn't exist
	 */
	getPlayersInVoice(gameId: string): Array<any> | boolean {
		const game = this.find(gameId).game;

		return game ? game.players_in_voice : false;
	}

	/**
	 * Add a player to the list of players in voice
	 * @param {string} gameId The current game id for the voice channel
	 * @param {string} socketId The current socket id of the player
	 * @returns {boolean} True if the player was added, false if the game doesn't exist
	 */
	addPlayerToVoice(gameId: string, socketId: string): boolean {
		const game = this.find(gameId);

		if (game.game) {
			game.game.players_in_voice.push(socketId);
			return true;
		}

		return false;
	}

	/**
	 * Remove a player from the list of players in voice
	 * @param {string} gameId The current game id for the voice channel
	 * @param {string} socketId The current socket id of the player
	 * @returns {Array|boolean} The list of players in voice or false if the game doesn't exist
	 */
	removePlayerFromVoice(
		gameId: string,
		socketId: string
	): Array<any> | boolean {
		const game = this.find(gameId);

		if (game.game) {
			game.game.players_in_voice = game.game.players_in_voice.filter(
				(player) => player !== socketId
			);
			return game.game.players_in_voice;
		}

		return false;
	}

	/**
	 * Remove a game from the store
	 * @param {string} gameId The current game id to look for
	 * @returns {Array} Updated list of games
	 */
	remove(gameId: string): Array<any> {
		this.games = this.games.filter((game) => game.game_id !== gameId);
		return this.games;
	}
}

export default new GameStore();
