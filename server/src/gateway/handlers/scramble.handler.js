const Events = require("../events");
const Core = require("../common/core");
const Words = require("../../modules/words");
const Utility = require("../../helpers/utility");
const Validation = require("../../helpers/validate");
const GameStore = require("../../stores/game.store");
const PlayerStore = require("../../stores/player.store");
const ValidationSchemas = require("../../schemas/validation.schema");

/* Setup power ups */
const powerups = [
	{
		name: "scramble",
		coins: 2,
		duration: 0,
		target: "self"
	},
	{
		name: "freeze",
		coins: 6,
		duration: 10000,
		target: "others"
	},
	{
		name: "robbery",
		coins: 10,
		duration: 0,
		target: "others"
	},
	{
		name: "lottery",
		coins: 12,
		duration: 0,
		target: "self"
	},
	{
		name: "setback",
		coins: 15,
		duration: 0,
		target: "others"
	}
];

class ScrambleHandler {
	constructor(io, hostSocket) {
		this.io = io;
		this.gameId = "";
		this.hostSocket = hostSocket;

		/* Duration of the game in seconds */
		this.time = 300;

		/* Events that this specific game will listen for */
		this.events = {
			[Events.CHECK_GUESS]: this.submitGuess,
			[Events.USE_POWERUP]: this.usePowerup
		};
	}

	/**
	 * Generate a new set of letters and answer for the current player
	 * @param {Object} socket Socket instance from the current connection
	 */
	static generateShuffleSetAnswer = async (socket) => {
		let player = PlayerStore.find(socket.id).player;

		/* Determine the difficulty of the word */
		let difficulty;
		switch (true) {
			case player.score <= 8:
				difficulty = "easy";
				break;
			case player.score > 8:
				difficulty = "medium";
				break;
			case player.score > 16:
				difficulty = "hard";
				break;
			default:
				difficulty = "easy";
		}


		/* Generate a random word based on difficulty */
		let randomWord = Words.RandomWord(difficulty);

		/* Shuffle the letters and get the definition of the generated word */
		let shuffledLetters = Utility.shuffle(randomWord);

		/* Make sure the word isn't scrambled to the same word */
		while (randomWord == shuffledLetters) {
			shuffledLetters = Utility.shuffle(randomWord);
		}

		let wordDefinition = await Core.getDefinition(randomWord);
		if (!wordDefinition) wordDefinition = "Unable to get definition.";

		/* Set the correct answer, and send the scrambled letters to the player */
		PlayerStore.modify(socket.id, "answer", randomWord);

		socket.emit(Events.NEW_LETTERS, {
			letters: shuffledLetters,
			definition: wordDefinition
		});
	};

	/**
	 * Clear an effect from the player after a certain period of time
	 * @param {Object} socket Socket instance from the current connection
	 * @param {String} effect The effect name to remove from the player
	 * @param {Integer} duration The duration of the effect in milliseconds
	 */
	async clearEffect(socket, effect, duration) {
		await Utility.delay(duration);

		PlayerStore.removeEffect(socket.id, effect);

		socket.emit(Events.POWERUP_EFFECT_CLEARED, effect);
	}

	/**
	 * Get a random player socket instance excluding the current player
	 * @param {Object} socket Socket instance from the current connection
	 * @returns {Object} Socket instance of a random player
	 */
	getRandomPlayerSocketExclude(socket) {
		const players = PlayerStore.all(this.gameId);

		let randomPlayer = players[Math.floor(Math.random() * players.length)];
		if (!randomPlayer.player_socket) return {};

		while (randomPlayer.player_socket === socket.id) {
			randomPlayer = players[Math.floor(Math.random() * players.length)];
		}

		return this.io.sockets.sockets.get(randomPlayer.player_socket);
	}

	/**
	 * Initialize the the scramble game mode
	 */
	init = async () => {
		/* Get the game by the host socket id */
		let { game_id } = GameStore.getGameByHost(this.hostSocket.id);

		this.gameId = game_id;

		/* Set the game timer */
		let time = new Date();
		let timeMilliseconds = Utility.secondsToMillis(this.time);
		let timeSeconds = Utility.millisToSeconds(timeMilliseconds);
		time.setSeconds(time.getSeconds() + timeSeconds);

		/* Send the game timer timestamp to the players */
		this.io.to(this.gameId).emit(Events.GAME_TIMER_SET, time.toUTCString());
		Utility.delay(timeMilliseconds).then(() => {
			this.io.to(this.gameId).emit(Events.GAME_OVER);
		});

		/* Loop through current players in the game and dynamically add event listeners */
		const sockets = await this.io.in(this.gameId).fetchSockets();
		for (let socket of sockets) {
			for (let [event, callback] of Object.entries(this.events)) {
				let possibleEvent = socket._events[event];
				if (typeof possibleEvent === "undefined" || possibleEvent === null)
					socket.on(event, (data) => callback(socket, data));
			}

			/* Generate a new set of letters and answer for the current player */
			this.constructor.generateShuffleSetAnswer(socket);
		}
	};

	submitGuess = async (socket, data) => {
		/* Validate the incoming data */
		const { status, error } = Validation.Validate(
			data,
			ValidationSchemas.gateway.gameAnswer
		);

		if (!status) return socket.emit(Events.ERROR_OCCURRED, error);

		/* Check if the player is frozen */
		const player = PlayerStore.find(socket.id).player;
		switch (player.effect) {
			case "freeze":
				return socket.emit(Events.ERROR_OCCURRED, "You are frozen.");
		}

		let { answer } = data;

		/* Check if the player's answer is correct */
		if (answer.toLowerCase() === player.answer.toLowerCase()) {
			/* Generate a random number of coins to award the player */
			let coins = Utility.randomNumberBetween(1, 5);

			/* Increment the player's score and coins */
			let playerCoins = PlayerStore.incrementValueBy(socket.id, "coins", coins);
			socket.emit(Events.UPDATE_COINS, playerCoins);

			let playerScore = PlayerStore.incrementValueBy(socket.id, "score", 1);
			socket.emit(Events.UPDATE_SCORE, playerScore);

			/* Broadcast the correct guess event to the player */
			socket.emit(Events.CORRECT_GUESS);

			/* Generate a new set of letters and answer for the current player */
			this.constructor.generateShuffleSetAnswer(socket);
		} else {
			socket.emit(Events.INCORRECT_GUESS);
		}
	};

	usePowerup = async (socket, data) => {
		/* Validate the incoming data */
		const { status, error } = Validation.Validate(
			data,
			ValidationSchemas.gateway.buyPowerup
		);
		if (!status) return socket.emit(Events.ERROR_OCCURRED, error);

		/* Get the current player and powerup */
		let player = PlayerStore.find(socket.id).player;
		let powerup = powerups.find((powerup) => powerup.name === data.powerup);

		/* Check if the player has enough coins to purchase the powerup, and the powerup is valid */
		if (!powerup) return socket.emit(Events.ERROR_OCCURRED, "Invalid powerup.");
		if (player.coins < powerup.coins)
			return socket.emit(
				Events.ERROR_OCCURRED,
				"You do not have enough coins to purchase this powerup."
			);

		/* Determine the target of the powerup */
		let target = socket;
		switch (powerup.target) {
			case "self":
				target = socket;
				break;
			case "others":
				target = this.getRandomPlayerSocketExclude(socket);
				break;
		}

		/* Check if the target is valid */
		if (target.length == 0) return;

		/* Decrement the player's coins after purchasing the powerup */
		let playerCoins = PlayerStore.decrementValueBy(socket.id, "coins", powerup.coins);
		socket.emit(Events.UPDATE_COINS, playerCoins);

		/* Apply the powerup to the target */
		switch (powerup.name) {
			case "scramble":
				this.constructor.generateShuffleSetAnswer(target);
				break;
			case "freeze":
				PlayerStore.addEffect(target.id, "freeze");
				target.emit(Events.POWERUP_RECEIVED, {
					name: "freeze",
					duration: powerup.duration
				});
				this.clearEffect(target, powerup.name, powerup.duration);
				break;
			case "lottery":
				let randomLottery = Utility.randomNumberBetween(1, 15);
				if (randomLottery == 15) {
					let playerCoins = PlayerStore.incrementValueBy(
						target.id,
						"coins",
						player.coins * 2 + powerup.coins
					);
					target.emit(Events.UPDATE_COINS, playerCoins);
				}
				break;
			case "robbery":
				let randomRobbery = Utility.randomNumberBetween(1, 2);
				if (randomRobbery == 1) {
					let targetCoins = PlayerStore.get(target.id, "coins");
					let randomCoinsToSteal = Utility.randomNumberBetween(1, 10);

					if (targetCoins < randomCoinsToSteal)
						randomCoinsToSteal = targetCoins;
					if (randomCoinsToSteal == 0)
						return socket.emit(
							Events.ERROR_OCCURRED,
							"The victim has no coins to steal."
						);

					let victimCoinRemove = PlayerStore.decrementValueBy(
						target.id,
						"coins",
						randomCoinsToSteal
					);
					target.emit(Events.UPDATE_COINS, victimCoinRemove);

					let thiefCoinsGain = PlayerStore.incrementValueBy(
						socket.id,
						"coins",
						randomCoinsToSteal + powerup.coins
					);
					socket.emit(Events.UPDATE_COINS, thiefCoinsGain);
				}
				break;
			case "setback":
				let setbackScore = 5;
				let targetPlayerScore = PlayerStore.get(target.id, "score");

				if (targetPlayerScore < setbackScore) setbackScore = targetPlayerScore;
				if (setbackScore == 0)
					return socket.emit(
						Events.ERROR_OCCURRED,
						"The victim already has a score of zero."
					);

				let playerScore = PlayerStore.decrementValueBy(target.id, "score", setbackScore);
				target.emit(Events.UPDATE_SCORE, playerScore);
				break;
		}

		socket.emit(Events.POWERUP_USED, powerup.name);
	};
}

module.exports = ScrambleHandler;
