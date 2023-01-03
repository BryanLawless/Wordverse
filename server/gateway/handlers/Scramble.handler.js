const Events = require('../Events');
const Core = require('../common/Core');
const Utility = require('../../helpers/Utility');
const Validation = require('../../helpers/Validate');
const GameStore = require('../../stores/Game.store');
const PlayerStore = require('../../stores/Player.store');
const WordGenerator = require('../../modules/words/Generate');
const ValidationSchemas = require('../../schemas/Validation.schema');

const powerups = [
	{
		name: 'freeze',
		coins: 6,
		duration: 10000,
		target: 'others'
	},
	{
		name: 'scramble',
		coins: 9,
		duration: 0,
		target: 'others'
	},
	{
		name: 'lottery',
		coins: 18,
		duration: 0,
		target: 'self'
	},
	{
		name: 'robbery',
		coins: 18,
		duration: 0,
		target: 'others'
	},
	{
		name: 'setback',
		coins: 20,
		duration: 0,
		target: 'others'
	},
]

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
			[Events.USE_POWERUP]: this.usePowerup,
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

	async clearEffect(socket, effect, duration) {
		await Utility.delay(duration);

		PlayerStore.removeEffect(socket.id, effect);

		socket.emit(Events.POWERUP_EFFECT_CLEARED, effect);
	}

	getRandomPlayerSocketExclude(socket) {
		const players = PlayerStore.getPlayers(this.gameId);

		let randomPlayer = players[Math.floor(Math.random() * players.length)];
		while (randomPlayer.player_socket_id === socket.id) {
			randomPlayer = players[Math.floor(Math.random() * players.length)];
		}

		return this.io.sockets.sockets.get(randomPlayer.player_socket_id);
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

		this.io.to(this.gameId).emit(Events.GAME_TIMER_SET, time.toUTCString());
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

		const player = PlayerStore.getPlayer(socket.id);
		switch (player.effect) {
			case 'freeze':
				return socket.emit(Events.ERROR_OCCURED, 'You are frozen.');
		}

		let { answer } = data;

		if (answer.toLowerCase() === player.answer.toLowerCase()) {
			let coins = Utility.randomNumberBetween(1, 3);

			let playerCoins = PlayerStore.addCoins(socket.id, coins);
			socket.emit(Events.UPDATE_COINS, playerCoins);

			let playerScore = PlayerStore.addScore(socket.id, 1);
			socket.emit(Events.UPDATE_SCORE, playerScore);

			socket.emit(Events.CORRECT_GUESS);

			this.constructor.generateShuffleSetAnswer(socket);
		} else {
			socket.emit(Events.INCORRECT_GUESS);
		}
	}

	usePowerup = async (socket, data) => {
		const { status, error } = Validation.Validate(data, ValidationSchemas.gateway.buyPowerup);
		if (!status) return socket.emit(Events.ERROR_OCCURED, error);

		let player = PlayerStore.getPlayer(socket.id);
		let powerup = powerups.find(powerup => powerup.name === data.powerup);

		if (!powerup) return socket.emit(Events.ERROR_OCCURED, 'Invalid powerup.');
		if (player.coins < powerup.coins) return socket.emit(Events.ERROR_OCCURED, 'You do not have enough coins to purchase this powerup.');

		let playerCoins = PlayerStore.removeCoins(socket.id, powerup.coins);
		socket.emit(Events.UPDATE_COINS, playerCoins);

		let target = socket;
		switch (powerup.target) {
			case 'self':
				target = socket;
				break;
			case 'others':
				target = this.getRandomPlayerSocketExclude(socket);
				break;
		}

		switch (powerup.name) {
			case 'scramble':
				this.constructor.generateShuffleSetAnswer(target);
				break;
			case 'freeze':
				PlayerStore.addEffect(target.id, 'freeze');
				target.emit(Events.POWERUP_RECIEVED, { name: 'freeze', duration: powerup.duration });
				this.clearEffect(target, powerup.name, powerup.duration);
				break;
			case 'lottery':
				let randomLottery = Utility.randomNumberBetween(1, 15);
				if (randomLottery == 15) {
					let playerCoins = PlayerStore.addCoins(target.id, player.coins * 2);
					target.emit(Events.UPDATE_COINS, playerCoins);
				}
				break;
			case 'robbery':
				let randomRobbery = Utility.randomNumberBetween(1, 4);
				if (randomRobbery != 4) {
					let randomCoinsToSteal = Utility.randomNumberBetween(1, 5);
					let victimCoinRemove = PlayerStore.removeCoins(target.id, randomCoinsToSteal);
					target.emit(Events.UPDATE_COINS, victimCoinRemove);

					let thiefCoinsGain = PlayerStore.addCoins(socket.id, randomCoinsToSteal + powerup.coins);
					socket.emit(Events.UPDATE_COINS, thiefCoinsGain);
				}
				break;
			case 'setback':
				let playerScore = PlayerStore.removeScore(target.id, 5);
				target.emit(Events.UPDATE_SCORE, playerScore);
				break;
		}

		socket.emit(Events.POWERUP_USED, powerup.name);
	}
}

module.exports = ScrambleHandler;