const httpStatus = require('http-status');
const { sendResponse } = require('../helpers/Response');
const GameService = require('../services/Game.service');

class GameController {
	constructor() {
		this.gameService = new GameService();
	}

	health = async (req, res) => {
		sendResponse(res, httpStatus.OK, "Healthy.");
	}
}

module.exports = GameController;