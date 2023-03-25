const GameStore = require("../stores/game.store");
const PlayerStore = require("../stores/player.store");
const { serviceToController } = require("../helpers/response");

class GameService {

	/**
	 * Get the amount of games requested
	 * @param {Object} req Request instance
	 * @param {Object} res Response instance 
	 * @returns {Object} Service to controller response
	 */
	getGames = async (req, res) => {
		let gameAmount = Number(req.params.amount);
		if (gameAmount === NaN || gameAmount < 1)
			return serviceToController("ERR_INVALID_AMOUNT");

		let gamesFound = GameStore.getAmount(gameAmount);
		if (gamesFound <= 0) return serviceToController("ERR_NO_GAMES_FOUND");

		return serviceToController("SUCCESS_GAMES_FOUND", gamesFound);
	};

	/**
	 * Get the game info for a specific game
	 * @param {Object} req Request instance
	 * @param {Object} res Response instance
	 * @returns {Object} Service to controller response
	 */
	getGameInfo = async (req, res) => {
		let gameId = req.params.gameId;
		if (gameId === NaN || gameId < 1)
			return serviceToController("ERR_INVALID_GAME_ID");

		let gameFound = GameStore.find(gameId).game;
		if (!gameFound) return serviceToController("ERR_GAME_DOES_NOT_EXIST");

		return serviceToController("SUCCESS_GAME_FOUND", gameFound);
	};

	/**
	 * Get all the players in a specific game
	 * @param {Object} req Request instance
	 * @param {Object} res Response instance
	 * @returns {Object} Service to controller response
	 */
	getGamePlayers = async (req, res) => {
		let gameId = req.params.gameId;
		if (gameId === NaN || gameId < 1)
			return serviceToController("ERR_INVALID_GAME_ID");

		let gameFound = GameStore.get(gameId, "game_name");
		if (!gameFound) return serviceToController("ERR_GAME_DOES_NOT_EXIST");

		let playersFound = PlayerStore.all(gameId);
		if (playersFound.length <= 0)
			return serviceToController("ERR_NO_PLAYERS_FOUND");

		return serviceToController("SUCCESS_PLAYERS_FOUND", playersFound);
	};

	/**
	 * Calculate the leaderboard for a specific game
	 * @param {Object} req Request instance
	 * @param {Object} res Response instance
	 * @returns {Object} Service to controller response
	 */
	getGameLeaderboard = async (req, res) => {
		let gameId = req.params.gameId;
		if (gameId === NaN || gameId < 1)
			return serviceToController("ERR_INVALID_GAME_ID");

		let gamePlayers = PlayerStore.all(gameId);
		if (gamePlayers.length <= 0)
			return serviceToController("ERR_NO_PLAYERS_FOUND");

		gamePlayers.sort(function (a, b) {
			return b.score - a.score;
		});

		return serviceToController("SUCCESS_LEADERBOARD", gamePlayers);
	};
}

module.exports = GameService;
