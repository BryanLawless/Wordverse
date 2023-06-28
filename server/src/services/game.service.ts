import { Request, Response } from 'express';
import GameStore from '../stores/game.store.js';
import PlayerStore from '../stores/player.store.js';
import { serviceToController, ServiceToController } from '../util/response.js';

class GameService {
	/**
	 * Get the amount of games requested
	 * @param {Request} req Request instance
	 * @param {Response} res Response instance
	 * @returns {Promise<ServiceToController>} Service to controller response
	 */
	public static async getGames(
		req: Request,
		res: Response
	): Promise<ServiceToController> {
		let gameAmount = Number(req.params.amount);
		if (Number.isNaN(gameAmount) || gameAmount < 1)
			return serviceToController('ERR_INVALID_AMOUNT');

		let gamesFound = GameStore.getAmount(gameAmount);
		if (gamesFound.length <= 0)
			return serviceToController('ERR_NO_GAMES_FOUND');

		return serviceToController('SUCCESS_GAMES_FOUND', gamesFound);
	}

	/**
	 * Get the game info for a specific game
	 * @param {Request} req Request instance
	 * @param {Response} res Response instance
	 * @returns {Promise<ServiceToController>} Service to controller response
	 */
	public static async getGameInfo(
		req: Request,
		res: Response
	): Promise<ServiceToController> {
		let gameId = req.params.gameId;
		if (Number.isNaN(gameId) || Number(gameId) < 1)
			return serviceToController('ERR_INVALID_GAME_ID');

		let gameFound = GameStore.find(gameId).game;
		if (!gameFound) return serviceToController('ERR_GAME_DOES_NOT_EXIST');

		return serviceToController('SUCCESS_GAME_FOUND', gameFound);
	}

	/**
	 * Get all the players in a specific game
	 * @param {Request} req Request instance
	 * @param {Response} res Response instance
	 * @returns {Promise<ServiceToController>} Service to controller response
	 */
	public static async getGamePlayers(
		req: Request,
		res: Response
	): Promise<ServiceToController> {
		let gameId = req.params.gameId;
		if (Number.isNaN(gameId) || Number(gameId) < 1)
			return serviceToController('ERR_INVALID_GAME_ID');

		let gameFound = GameStore.get(gameId, 'game_name');
		if (!gameFound) return serviceToController('ERR_GAME_DOES_NOT_EXIST');

		let playersFound = PlayerStore.all(gameId);
		if (playersFound.length <= 0)
			return serviceToController('ERR_NO_PLAYERS_FOUND');

		playersFound.forEach((player) => {
			if (player.answer) delete player.answer;
		});

		return serviceToController('SUCCESS_PLAYERS_FOUND', playersFound);
	}

	/**
	 * Calculate the leaderboard for a specific game
	 * @param {Request} req Request instance
	 * @param {Response} res Response instance
	 * @returns {Promise<ServiceToController>} Service to controller response
	 */
	public static async getGameLeaderboard(
		req: Request,
		res: Response
	): Promise<ServiceToController> {
		let gameId = req.params.gameId;
		if (Number.isNaN(gameId) || Number(gameId) < 1)
			return serviceToController('ERR_INVALID_GAME_ID');

		let gamePlayers = PlayerStore.all(gameId);
		if (gamePlayers.length <= 0)
			return serviceToController('ERR_NO_PLAYERS_FOUND');

		gamePlayers.sort(function (a, b) {
			return b.score - a.score;
		});

		return serviceToController('SUCCESS_LEADERBOARD', gamePlayers);
	}
}

export default GameService;
