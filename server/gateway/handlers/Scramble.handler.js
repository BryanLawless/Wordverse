const Events = require('../Events');
const Core = require('../common/Core');
const Utility = require('../../helpers/Utility');
const Validation = require('../../helpers/Validate');
const GameStore = require('../../stores/Game.store');
const PlayerStore = require('../../stores/Player.store');
const WordGenerator = require('../../modules/words/Generate');
const ValidationSchemas = require('../../schemas/Validation.schema');

class ScrambleHandler {
	constructor(io, hostSocket) {
		this.io = io;
		this.gameId = '';
		this.hostSocket = hostSocket;

		this.name = 'scramble';
		this.time = 300000;
		this.tutorial = [
			'Unscramble as many words as you can before the timer runs out.',
			'Each word you unscramble will give you coins.',
			'Coins can purchase power-ups to use against other players.',
			'The player with the most points at the end of the game wins.',
		];

		this.events = {
			[Events.CHECK_GUESS]: this.submitGuess,
		};
	}

	static generateShuffleSetAnswer = async (socket) => {
		let player = PlayerStore.getPlayer(socket.id);

		let difficulty;
		switch (true) {
			case (player.score <= 8):
				difficulty = 'easy';
				break;
			case (player.score > 8):
				difficulty = 'medium';
				break;
			case (player.score > 16):
				difficulty = 'hard';
				break;
			default:
				difficulty = 'easy';
		}

		let randomWword = WordGenerator.RandomWord(difficulty);

		let shuffedLetters = Utility.shuffle(randomWword);
		let wordDefinition = await Core.getDefinition(randomWword);
		if (!wordDefinition) wordDefinition = 'Unable to get definition.';

		PlayerStore.setAnswer(socket.id, randomWword);

		socket.emit(Events.NEW_LETTERS, { letters: shuffedLetters, definition: wordDefinition });
	}

	init = async () => {
		let { game_id } = GameStore.getGameByHostId(this.hostSocket.id);

		this.gameId = game_id;

		for (let i = 0; i < this.tutorial.length; i++) {
			this.io.to(this.gameId).emit(Events.TUTORIAL_PROGRESS, this.tutorial[i]);
			await Utility.delay(i + 1 * 3100);
		}

		this.io.to(this.gameId).emit(Events.TUTORIAL_FINISHED);

		let time = new Date();
		let timeSeconds = Utility.millisToSeconds(this.time);
		time.setSeconds(time.getSeconds() + timeSeconds);

		this.io.to(this.gameId).emit(Events.GAME_TIMER_SET, time.toLocaleString());
		Utility.delay(this.time).then(() => {
			this.io.to(this.gameId).emit(Events.GAME_OVER);
		});

		const sockets = await this.io.in(this.gameId).fetchSockets();
		for (let socket of sockets) {
			for (let [event, callback] of Object.entries(this.events)) {
				if (typeof variable === 'undefined' || variable === null) socket.on(event, (data) => callback(socket, data));
			}

			this.constructor.generateShuffleSetAnswer(socket);
		}
	}

	submitGuess = async (socket, data) => {
		const { status, error } = Validation.Validate(data, ValidationSchemas.gateway.gameAnswer);
		if (!status) return socket.emit(Events.ERROR_OCCURED, error);

		let { answer } = data;
		let player = PlayerStore.getPlayer(socket.id);

		if (answer.toLowerCase() === player.answer.toLowerCase()) {
			let coins = Utility.randomNumberBetween(1, 3);

			let playerCoins = PlayerStore.addCoins(socket.id, coins);
			socket.emit(Events.UPDATE_COINS, playerCoins);

			let playerScore = PlayerStore.addScore(socket.id, 1);
			socket.emit(Events.UPDATE_SCORE, playerScore);

			this.constructor.generateShuffleSetAnswer(socket);
		}
	}
}

module.exports = ScrambleHandler;