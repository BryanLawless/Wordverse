const GameStore = require('../stores/Game.store');
const PlayerStore = require('../stores/Player.store');
const { serviceToController } = require('../helpers/Response');

class GameService {

	getGames = async (req, res) => {
		let gameAmount = Number(req.params.amount);
		if (gameAmount === NaN || gameAmount < 1) return serviceToController('ERR_INVALID_AMOUNT');

		let gamesFound = GameStore.getGameAmount(gameAmount);
		if (gamesFound.length <= 0) return serviceToController('ERR_NO_GAMES_FOUND');

		return serviceToController('SUCCESS_GAMES_FOUND', gamesFound);
	}

	getGameInfo = async (req, res) => {
		let gameId = req.params.gameId;
		if (gameId === NaN || gameId < 1) return serviceToController('ERR_INVALID_GAME_ID');

		let gameFound = GameStore.getGameById(gameId);
		if (!gameFound) return serviceToController('ERR_GAME_DOES_NOT_EXIST');

		return serviceToController('SUCCESS_GAME_FOUND', gameFound);
	}

	getGamePlayers = async (req, res) => {
		let gameId = req.params.gameId;
		if (gameId === NaN || gameId < 1) return serviceToController('ERR_INVALID_GAME_ID');

		let gameFound = GameStore.getGameById(gameId);
		if (!gameFound) return serviceToController('ERR_GAME_DOES_NOT_EXIST');

		let playersFound = PlayerStore.getPlayers(gameId);
		if (playersFound.length <= 0) return serviceToController('ERR_NO_PLAYERS_FOUND');

		return serviceToController('SUCCESS_PLAYERS_FOUND', playersFound);
	}

	getGameLeaderboard = async (req, res) => {
		let gameId = req.params.gameId;
		if (gameId === NaN || gameId < 1) return serviceToController('ERR_INVALID_GAME_ID');

		let gamePlayers = PlayerStore.getPlayers(gameId);
		if (gamePlayers.length <= 0) return serviceToController('ERR_NO_PLAYERS_FOUND');

		gamePlayers.sort(function (a, b) {
			return b.score - a.score;
		});

		return serviceToController('SUCCESS_LEADERBOARD', gamePlayers);
	}
}

module.exports = GameService;