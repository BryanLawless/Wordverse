import request from '@/api/request.js';

export class GameService {
	/**
	 * Get a list of ten games
	 * @returns {Promise<object>} The response from the API or false if the request failed
	 */
	static async getGames(): Promise<object> {
		let { status, response } = await request('games/get/10', 'GET');

		return status == 200 ? response.data : {};
	}

	/**
	 * Get the info of a specific game
	 * @param {string} gameId The ID of the game to get
	 * @returns {Promise<object>} The response from the API or false if the request failed
	 */
	static async getGame(gameId: string[] | string): Promise<object> {
		let { status, response } = await request(`games/info/${gameId}`, 'GET');

		return status == 200 ? response.data : {};
	}

	/**
	 * Get all the players in a specific game
	 * @param {string} gameId The ID of the game to get the players of
	 * @returns {Promise<object>} The response from the API or false if the request failed
	 */
	static async getGamePlayers(gameId: string[] | string): Promise<object> {
		let { status, response } = await request(`games/players/${gameId}`, 'GET');

		return status == 200 ? response.data : {};
	}

	/**
	 * Get the leaderboard of a specific game
	 * @param {string} gameId The ID of the game to get the leaderboard of
	 * @returns {Promise<object>} The response from the API or false if the request failed
	 */
	static async getGameLeaderboard(gameId: string[] | string): Promise<object> {
		let { status, response } = await request(
			`games/leaderboard/${gameId}`,
			'GET'
		);

		return status == 200 ? response.data : false;
	}
}
