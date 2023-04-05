const httpStatus = require("http-status");
const { sendResponse } = require("../helpers/response");
const GameService = require("../services/game.service");

class GameController {
	constructor() {
		/* Create a new instance of the game service */
		this.gameService = new GameService();
	}

	/**
	 * Check if the server is accessible and healthy. TODO: Add more checks.
	 * @param {Object} req Request instance
	 * @param {Object} res Response instance
	 */
	health = async (req, res) => {
		sendResponse(res, httpStatus.OK, "Healthy.");
	};
}

module.exports = GameController;
