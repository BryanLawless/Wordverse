import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { sendResponse } from '../util/response.js';
import GameService from '../services/game.service.js';

class GameController {
	/**
	 * Get a specific amount of active games
	 * @param {Request} req Request instance
	 * @param {Response} res Response instance
	 */
	static async fetch(req: Request, res: Response) {
		let { event, data } = await GameService.getGames(req, res);

		switch (event) {
			case 'ERR_INVALID_AMOUNT':
				sendResponse(res, httpStatus.BAD_REQUEST, 'Invalid amount.');
				break;
			case 'ERR_NO_GAMES_FOUND':
				sendResponse(res, httpStatus.NOT_FOUND, 'No games found.');
				break;
			case 'SUCCESS_GAMES_FOUND':
				sendResponse(res, httpStatus.OK, 'Games found!', data);
				break;
		}
	}

	/**
	 * Get a specific game's info
	 * @param {Request} req Request instance
	 * @param {Response} res Response instance
	 */
	static async info(req: Request, res: Response) {
		let { event, data } = await GameService.getGameInfo(req, res);

		switch (event) {
			case 'ERR_INVALID_GAME_ID':
				sendResponse(res, httpStatus.BAD_REQUEST, 'Invalid game id.');
				break;
			case 'ERR_GAME_DOES_NOT_EXIST':
				sendResponse(res, httpStatus.NOT_FOUND, 'Game does not exist.');
				break;
			case 'SUCCESS_GAME_FOUND':
				sendResponse(res, httpStatus.OK, 'Game found!', data);
				break;
		}
	}

	/**
	 * Get a list of players in a game
	 * @param {Request} req Request instance
	 * @param {Response} res Response instance
	 */
	static async players(req: Request, res: Response) {
		let { event, data } = await GameService.getGamePlayers(req, res);

		switch (event) {
			case 'ERR_INVALID_GAME_ID':
				sendResponse(res, httpStatus.BAD_REQUEST, 'Invalid game id.');
				break;
			case 'ERR_GAME_DOES_NOT_EXIST':
				sendResponse(res, httpStatus.NOT_FOUND, 'Game does not exist.');
				break;
			case 'ERR_NO_PLAYERS_FOUND':
				sendResponse(res, httpStatus.NOT_FOUND, 'No players found.');
				break;
			case 'SUCCESS_PLAYERS_FOUND':
				sendResponse(res, httpStatus.OK, 'Players found!', data);
				break;
		}
	}

	/**
	 * Get the game leaderboard for a specific game
	 * @param {Request} req Request instance
	 * @param {Response} res Response instance
	 */
	static async leaderboard(req: Request, res: Response) {
		let { event, data } = await GameService.getGameLeaderboard(req, res);

		switch (event) {
			case 'ERR_INVALID_GAME_ID':
				sendResponse(res, httpStatus.BAD_REQUEST, 'Invalid game id.');
				break;
			case 'ERR_NO_PLAYERS_FOUND':
				sendResponse(res, httpStatus.NOT_FOUND, 'No players found.');
				break;
			case 'SUCCESS_LEADERBOARD':
				sendResponse(res, httpStatus.OK, 'Found leaderboard.', data);
				break;
		}
	}
}

export default GameController;
