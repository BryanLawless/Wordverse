class PlayerStore {
	constructor() {
		this.players = []
	}

	addPlayer(playerSocketId, gameId, nickname) {
		let player = {
			player_socket_id: playerSocketId,
			game_id: gameId,
			nickname: nickname,
			answer: '',
			score: 0,
			coins: 0,
			effects: [],
		};

		this.players.push(player)
		return player;
	}

	getPlayers(gameId) {
		return this.players.filter((player) => player.game_id === gameId);
	}

	getPlayer(playerSocketId) {
		let fetchedPlayers = this.players.filter((player) => player.player_socket_id === playerSocketId);

		return (fetchedPlayers.length > 0 ? fetchedPlayers[0] : false);
	}

	playerInGame(playerSocketId) {
		return this.players.some(player => player.player_socket_id === playerSocketId) > 0;
	}

	getPlayerIndex(playerSocketId) {
		return this.players.findIndex(player => player.player_socket_id === playerSocketId);
	}

	setAnswer(playerSocketId, answer) {
		let playerIndex = this.getPlayerIndex(playerSocketId);

		if (this.players[playerIndex]) {
			this.players[playerIndex].answer = answer;
		}
	}

	getCoins(playerSocketId) {
		let playerIndex = this.getPlayerIndex(playerSocketId);

		if (this.players[playerIndex]) return this.players[playerIndex].coins;
	}

	getScore() {
		let playerIndex = this.getPlayerIndex(playerSocketId);

		if (this.players[playerIndex]) return this.players[playerIndex].score;
	}

	addCoins(playerSocketId, coins) {
		let playerIndex = this.getPlayerIndex(playerSocketId);

		return this.players[playerIndex].coins += coins;
	}

	addScore(playerSocketId, points) {
		let playerIndex = this.getPlayerIndex(playerSocketId);

		return this.players[playerIndex].score += points
	}

	removeScore(playerSocketId, points) {
		let playerIndex = this.getPlayerIndex(playerSocketId);

		return this.players[playerIndex].score -= points;
	}

	removeCoins(playerSocketId, coins) {
		let playerIndex = this.getPlayerIndex(playerSocketId);

		return this.players[playerIndex].coins -= coins;
	}

	nicknameExistsInGame(nickname, gamePin) {
		let playersInGame = this.getPlayers(gamePin);

		return playersInGame.some(player => player.nickname === nickname);
	}

	addEffect(socketId, effect) {
		let playerIndex = this.getPlayerIndex(socketId);

		this.players[playerIndex].effects.push(effect);
	}

	removeEffect(socketId, effectName) {
		let playerIndex = this.getPlayerIndex(socketId);

		if (this.players[playerIndex]) {
			this.players[playerIndex].effects = this.players[playerIndex].effects.filter((effect) => effect.name != effectName);
		}
	}

	removePlayer(playerSocketId) {
		var player = this.getPlayer(playerSocketId);

		return (player ? this.players = this.players.filter((player) => player.player_socket_id != playerSocketId) : false);
	}

	removePlayers(gameId) {
		let removePlayers = this.getPlayers(gameId);
		for (var i = 0; i < removePlayers.length; i++) {
			this.removePlayer(removePlayers[i].player_socket_id);
		}
	}
}

module.exports = new PlayerStore();