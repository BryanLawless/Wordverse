const httpStatus = require('http-status');
const { sendResponse } = require('../helpers/Response');
const GameService = require('../services/Game.service');

class GameController {
	constructor() {
		this.gameService = new GameService();
	}

	fetch = async (req, res) => {
		let { event, data } = await this.gameService.getGames(req, res);

		switch (event) {
			case 'ERR_INVALID_AMOUNT':
				return sendResponse(res, httpStatus.BAD_REQUEST, 'Invalid amount.');
			case 'ERR_NO_GAMES_FOUND':
				return sendResponse(res, httpStatus.NOT_FOUND, 'No games found.');
			case 'SUCCESS_GAMES_FOUND':
				return sendResponse(res, httpStatus.OK, 'Games found!', data);
		}
	}

	info = async (req, res) => {
		let { event, data } = await this.gameService.getGameInfo(req, res);

		switch (event) {
			case 'ERR_INVALID_GAME_ID':
				return sendResponse(res, httpStatus.BAD_REQUEST, 'Invalid game id.');
			case 'ERR_GAME_DOES_NOT_EXIST':
				return sendResponse(res, httpStatus.NOT_FOUND, 'Game does not exist.');
			case 'SUCCESS_GAME_FOUND':
				return sendResponse(res, httpStatus.OK, 'Game found!', data);
		}
	}

	players = async (req, res) => {
		let { event, data } = await this.gameService.getGamePlayers(req, res);

		switch (event) {
			case 'ERR_INVALID_GAME_ID':
				return sendResponse(res, httpStatus.BAD_REQUEST, 'Invalid game id.');
			case 'ERR_GAME_DOES_NOT_EXIST':
				return sendResponse(res, httpStatus.NOT_FOUND, 'Game does not exist.');
			case 'ERR_NO_PLAYERS_FOUND':
				return sendResponse(res, httpStatus.NOT_FOUND, 'No players found.');
			case 'SUCCESS_PLAYERS_FOUND':
				return sendResponse(res, httpStatus.OK, 'Players found!', data);
		}
	}

	leaderboard = async (req, res) => {
		let { event, data } = await this.gameService.getGameLeaderboard(req, res);

		switch (event) {
			case 'ERR_INVALID_GAME_ID':
				return sendResponse(res, httpStatus.BAD_REQUEST, 'Invalid game id.');
			case 'ERR_NO_PLAYERS_FOUND':
				return sendResponse(res, httpStatus.NOT_FOUND, 'No players found.');
			case 'ERR_NO_PLAYERS_FOUND':
				return sendResponse(res, httpStatus.NOT_FOUND, 'No players found.');
			case 'SUCCESS_LEADERBOARD':
				return sendResponse(res, httpStatus.OK, 'Found leaderboard.', data);
		}
	}
}

module.exports = GameController;