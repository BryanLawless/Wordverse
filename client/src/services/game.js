import request from "@/api/request.js";

export class GameService {

	/**
	 * Get a list of ten games
	 * @returns {Object|Boolean} The response from the API or false if the request failed
	 */
	static async getGames() {
		let { status, response } = await request("games/get/10", "GET");

		return status == 200 ? response.data : false;
	}

	/**
	 * Get the info of a specific game
	 * @param {String} gameId The ID of the game to get
	 * @returns {Object|Boolean} The response from the API or false if the request failed
	 */
	static async getGame(gameId) {
		let { status, response } = await request(`games/info/${gameId}`, "GET");

		return status == 200 ? response.data : false;
	}

	/**
	 * Get all the players in a specific game
	 * @param {String} gameId The ID of the game to get the players of
	 * @returns {Object|Boolean} The response from the API or false if the request failed
	 */
	static async getGamePlayers(gameId) {
		let { status, response } = await request(`games/players/${gameId}`, "GET");

		return status == 200 ? response.data : false;
	}

	/**
	 * Get the leaderboard of a specific game
	 * @param {String} gameId The ID of the game to get the leaderboard of
	 * @returns {Object|Boolean} The response from the API or false if the request failed
	 */
	static async getGameLeaderboard(gameId) {
		let { status, response } = await request(
			`games/leaderboard/${gameId}`,
			"GET"
		);

		return status == 200 ? response.data : false;
	}
}
