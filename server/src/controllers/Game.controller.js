const httpStatus = require("http-status");
const { sendResponse } = require("../helpers/response");
const GameService = require("../services/game.service");

class GameController {
	constructor() {
		/* Create a new instance of the game service */
		this.gameService = new GameService();
	}

	/**
	 * Get a specific amount of active games
	 * @param {Object} req Request instance
	 * @param {Object} res Response instance
	 */
	fetch = async (req, res) => {
		let { event, data } = await this.gameService.getGames(req, res);

		switch (event) {
			case "ERR_INVALID_AMOUNT":
				sendResponse(res, httpStatus.BAD_REQUEST, "Invalid amount.");
				break;
			case "ERR_NO_GAMES_FOUND":
				sendResponse(res, httpStatus.NOT_FOUND, "No games found.");
				break;
			case "SUCCESS_GAMES_FOUND":
				sendResponse(res, httpStatus.OK, "Games found!", data);
				break;
		}
	};

	/**
	 * Get a specific game's info
	 * @param {Object} req Request instance
	 * @param {Object} res Response instance
	 */
	info = async (req, res) => {
		let { event, data } = await this.gameService.getGameInfo(req, res);

		switch (event) {
			case "ERR_INVALID_GAME_ID":
				sendResponse(res, httpStatus.BAD_REQUEST, "Invalid game id.");
				break;
			case "ERR_GAME_DOES_NOT_EXIST":
				sendResponse(res, httpStatus.NOT_FOUND, "Game does not exist.");
				break;
			case "SUCCESS_GAME_FOUND":
				sendResponse(res, httpStatus.OK, "Game found!", data);
				break;
		}
	};

	/**
	 * Get a list of players in a game
	 * @param {Object} req Request instance
	 * @param {Object} res Response instance
	 */
	players = async (req, res) => {
		let { event, data } = await this.gameService.getGamePlayers(req, res);

		switch (event) {
			case "ERR_INVALID_GAME_ID":
				sendResponse(res, httpStatus.BAD_REQUEST, "Invalid game id.");
				break;
			case "ERR_GAME_DOES_NOT_EXIST":
				sendResponse(res, httpStatus.NOT_FOUND, "Game does not exist.");
				break;
			case "ERR_NO_PLAYERS_FOUND":
				sendResponse(res, httpStatus.NOT_FOUND, "No players found.");
				break;
			case "SUCCESS_PLAYERS_FOUND":
				sendResponse(res, httpStatus.OK, "Players found!", data);
				break;
		}
	};

	/**
	 * Get the game leaderboard for a specific game
	 * @param {Object} req Request instance
	 * @param {Object} res Response instance
	 */
	leaderboard = async (req, res) => {
		let { event, data } = await this.gameService.getGameLeaderboard(req, res);

		switch (event) {
			case "ERR_INVALID_GAME_ID":
				sendResponse(res, httpStatus.BAD_REQUEST, "Invalid game id.");
				break;
			case "ERR_NO_PLAYERS_FOUND":
				sendResponse(res, httpStatus.NOT_FOUND, "No players found.");
				break;
			case "SUCCESS_LEADERBOARD":
				sendResponse(res, httpStatus.OK, "Found leaderboard.", data);
				break;
		}
	};
}

module.exports = GameController;
