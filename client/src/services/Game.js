import request from '@/api/Request.js';

export class GameService {

	static async getGames() {
		let { status, response } = await request('games/get/10', 'GET');

		return (status == 200) ? response.data : false;
	}

	static async getGame(gameId) {
		let { status, response } = await request(`games/info/${gameId}`, 'GET');

		return (status == 200) ? response.data : false;
	}

	static async getGamePlayers(gameId) {
		let { status, response } = await request(`games/players/${gameId}`, 'GET');

		return (status == 200) ? response.data : false;
	}

	static async getGameLeaderboard(gameId) {
		let { status, response } = await request(`games/leaderboard/${gameId}`, 'GET');

		return (status == 200) ? response.data : false;
	}
}