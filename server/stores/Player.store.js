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
		this.players[playerIndex].answer = answer;
	}

	addCoins(playerSocketId, coins) {
		let playerIndex = this.getPlayerIndex(playerSocketId);

		return this.players[playerIndex].coins += coins;
	}

	addScore(playerSocketId, points) {
		let playerIndex = this.getPlayerIndex(playerSocketId);

		return this.players[playerIndex].score += points
	}

	nicknameExistsInGame(nickname, gamePin) {
		let playersInGame = this.getPlayers(gamePin);

		return playersInGame.some(player => player.nickname === nickname);
	}

	removePlayer(playerSocketId) {
		var player = this.getPlayer(playerSocketId);

		return (player ? this.players = this.players.filter((player) => player.player_socket_id !== playerSocketId) : false);
	}

	removePlayers(gameId) {
		let removePlayers = this.getPlayers(gameId);
		for (var i = 0; i < removePlayers.length; i++) {
			this.removePlayer(removePlayers[i].player_socket_id);
		}
	}
}

module.exports = new PlayerStore();