import { Server } from 'socket.io';
import validate from '../../util/validate.js';
import { getDefinition } from '../common/core.js';
import GameStore from '../../stores/game.store.js';
import PlayerStore from '../../stores/player.store.js';
import { randomWord } from '../../modules/words/index.js';
import { Powerups } from '../../types/game.types.js';
import { SocketExtended } from '../../types/extend.types.js';
import gatewayValidation from '../../validation/gateway.validation.js';

import {
	shuffle,
	delay,
	secondsToMillis,
	randomNumberBetween
} from '../../util/util.js';

import {
	CHECK_GUESS,
	USE_POWERUP,
	NEW_LETTERS,
	POWERUP_EFFECT_CLEARED,
	SET_TIMER,
	GAME_OVER,
	ERROR_OCCURRED,
	UPDATE_COINS,
	UPDATE_SCORE,
	CORRECT_GUESS,
	INCORRECT_GUESS,
	POWERUP_RECEIVED,
	POWERUP_USED
} from '../events.js';

/* Setup power ups */
const powerups: Powerups = [
	{
		name: 'scramble',
		coins: 2,
		duration: 0,
		target: 'self'
	},
	{
		name: 'freeze',
		coins: 6,
		duration: 10000,
		target: 'others'
	},
	{
		name: 'robbery',
		coins: 10,
		duration: 0,
		target: 'others'
	},
	{
		name: 'lottery',
		coins: 12,
		duration: 0,
		target: 'self'
	},
	{
		name: 'setback',
		coins: 15,
		duration: 0,
		target: 'others'
	}
];

export default class ScrambleHandler {
	io: any;
	gameId: string;
	hostSocket: any;
	time: number;
	events: object;

	constructor(io: Server, hostSocket: SocketExtended) {
		this.io = io;
		this.gameId = '';
		this.hostSocket = hostSocket;

		/* Duration of the game in seconds */
		this.time = 300;

		/* Events that this specific game will listen for */
		this.events = {
			[CHECK_GUESS]: this.submitGuess,
			[USE_POWERUP]: this.usePowerup
		};
	}

	/**
	 * Generate a new set of letters and answer for the current player
	 * @param {SocketExtended} socket Socket instance from the current connection
	 */
	private static generateShuffleSetAnswer = async (socket: SocketExtended) => {
		let player = PlayerStore.find(socket.id).player;

		/* Determine the difficulty of the word */
		let difficulty: string;
		switch (true) {
			case player.score <= 8:
				difficulty = 'easy';
				break;
			case player.score > 8:
				difficulty = 'medium';
				break;
			case player.score > 16:
				difficulty = 'hard';
				break;
			default:
				difficulty = 'easy';
		}

		/* Generate a random word based on difficulty */
		let randomWordOrdered = randomWord(difficulty);

		/* Shuffle the letters and get the definition of the generated word */
		let shuffledLetters = shuffle(randomWordOrdered);

		/* Make sure the word isn't scrambled to the same word */
		while (randomWordOrdered == shuffledLetters) {
			shuffledLetters = shuffle(randomWordOrdered);
		}

		let wordDefinition = await getDefinition(randomWordOrdered);
		if (!wordDefinition) wordDefinition = 'Unable to get definition.';

		/* Set the correct answer, and send the scrambled letters to the player */
		PlayerStore.modify(socket.id, 'answer', randomWordOrdered);

		socket.emit(NEW_LETTERS, {
			letters: shuffledLetters,
			definition: wordDefinition
		});
	};

	/**
	 * Clear an effect from the player after a certain period of time
	 * @param {object} socket Socket instance from the current connection
	 * @param {string} effect The effect name to remove from the player
	 * @param {number} duration The duration of the effect in milliseconds
	 */
	private clearEffect = async (
		socket: SocketExtended,
		effect: string,
		duration: number
	) => {
		const effectTimer = delay(duration, socket.id);
		GameStore.addTimer(this.gameId, effectTimer);

		effectTimer.then((proceed) => {
			if (!proceed) return;

			PlayerStore.removeEffect(socket.id, effect);

			GameStore.removeTimer(this.gameId, effectTimer);

			socket.emit(POWERUP_EFFECT_CLEARED, effect);
		});
	};

	/**
	 * Get a random player socket instance excluding the current player
	 * @param {SocketExtended} socket Socket instance from the current connection
	 * @returns {SocketExtended} Socket instance of a random player
	 */
	private getRandomPlayerSocketExclude = (
		socket: SocketExtended
	): SocketExtended => {
		const players = PlayerStore.all(this.gameId);

		let randomPlayer = players[Math.floor(Math.random() * players.length)];

		if (!randomPlayer.player_socket) return;

		while (randomPlayer.player_socket === socket.id) {
			randomPlayer = players[Math.floor(Math.random() * players.length)];
		}

		return this.io.sockets.sockets.get(randomPlayer.player_socket);
	};

	/**
	 * Initialize the the scramble game mode
	 */
	init = async () => {
		/* Get the game by the host socket id */
		let { game_id } = GameStore.getGameByHost(this.hostSocket.id);

		this.gameId = game_id;

		/* Set the game timer */
		let time = new Date();
		time.setSeconds(time.getSeconds() + this.time);

		/* Send the game timer timestamp to the players */
		this.io.to(this.gameId).emit(SET_TIMER, time.toUTCString());
		const gameTimer = delay(secondsToMillis(this.time), 'server');
		GameStore.addTimer(this.gameId, gameTimer);

		/* When the game timer is up, end the game */
		gameTimer.then(() => {
			this.io.to(this.gameId).emit(GAME_OVER);

			/* Remove the game timer from the list of timers */
			GameStore.removeTimer(this.gameId, gameTimer);
		});

		/* Loop through current players in the game and dynamically add event listeners */
		const sockets = await this.io.in(this.gameId).fetchSockets();
		for (let socket of sockets) {
			for (let [event, callback] of Object.entries(this.events)) {
				let possibleEvent = socket._events[event];
				if (typeof possibleEvent === 'undefined' || possibleEvent === null)
					socket.on(event, (data: any) => callback(socket, data));
			}

			/* Generate a new set of letters and answer for the current player */
			ScrambleHandler.generateShuffleSetAnswer(socket);
		}
	};

	private submitGuess = async (socket: SocketExtended, data: any) => {
		/* Validate the incoming data */
		const { status, error } = validate(data, gatewayValidation.gameAnswer);

		if (!status) return socket.emit(ERROR_OCCURRED, error);

		/* Check if the player is frozen */
		const player = PlayerStore.find(socket.id).player;
		for (let i = 0; i < player.effects.length; i++) {
			if (player.effects[i] === 'freeze') {
				return socket.emit(ERROR_OCCURRED, 'You are frozen.');
			}
		}

		let { answer } = data;

		/* Check if the player's answer is correct */
		if (answer.toLowerCase() === player.answer.toLowerCase()) {
			/* Generate a random number of coins to award the player */
			let coins = randomNumberBetween(1, 5);

			/* Increment the player's score and coins */
			let playerCoins = PlayerStore.incrementValueBy(socket.id, 'coins', coins);
			socket.emit(UPDATE_COINS, playerCoins);

			let playerScore = PlayerStore.incrementValueBy(socket.id, 'score', 1);
			socket.emit(UPDATE_SCORE, playerScore);

			/* Broadcast the correct guess event to the player */
			socket.emit(CORRECT_GUESS);

			/* Generate a new set of letters and answer for the current player */
			ScrambleHandler.generateShuffleSetAnswer(socket);
		} else {
			socket.emit(INCORRECT_GUESS);
		}
	};

	private usePowerup = async (socket: SocketExtended, data: any) => {
		/* Validate the incoming data */
		const { status, error } = validate(data, gatewayValidation.buyPowerup);
		if (!status) return socket.emit(ERROR_OCCURRED, error);

		/* Get the current player and powerup */
		let player = PlayerStore.find(socket.id).player;
		let powerup = powerups.find((powerup) => powerup.name === data.powerup);

		/* Check if the player has enough coins to purchase the powerup, and the powerup is valid */
		if (!powerup) return socket.emit(ERROR_OCCURRED, 'Invalid powerup.');
		if (player.coins < powerup.coins)
			return socket.emit(
				ERROR_OCCURRED,
				'You do not have enough coins to purchase this powerup.'
			);

		/* Determine the target of the powerup */
		let target = socket;
		switch (powerup.target) {
			case 'self':
				target = socket;
				break;
			case 'others':
				target = this.getRandomPlayerSocketExclude(socket);
				break;
		}

		/* Check if the target is valid */
		if (!target) return;

		/* Decrement the player's coins after purchasing the powerup */
		let playerCoins = PlayerStore.decrementValueBy(
			socket.id,
			'coins',
			powerup.coins
		);
		socket.emit(UPDATE_COINS, playerCoins);

		/* Apply the powerup to the target */
		switch (powerup.name) {
			case 'scramble':
				ScrambleHandler.generateShuffleSetAnswer(target);
				break;
			case 'freeze':
				PlayerStore.addEffect(target.id, 'freeze');
				target.emit(POWERUP_RECEIVED, {
					name: 'freeze',
					duration: powerup.duration
				});
				this.clearEffect(target, powerup.name, powerup.duration);
				break;
			case 'lottery':
				let randomLottery = randomNumberBetween(1, 15);
				if (randomLottery == 15) {
					let playerCoins = PlayerStore.incrementValueBy(
						target.id,
						'coins',
						player.coins * 2 + powerup.coins
					);
					target.emit(UPDATE_COINS, playerCoins);
				}
				break;
			case 'robbery':
				let randomRobbery = randomNumberBetween(1, 2);
				if (randomRobbery == 1) {
					let targetCoins = PlayerStore.find(target.id);
					let randomCoinsToSteal = randomNumberBetween(1, 10);

					if (targetCoins.player.coins < randomCoinsToSteal)
						randomCoinsToSteal = targetCoins.player.coins;
					if (randomCoinsToSteal == 0)
						return socket.emit(
							ERROR_OCCURRED,
							'The victim has no coins to steal.'
						);

					let victimCoinRemove = PlayerStore.decrementValueBy(
						target.id,
						'coins',
						randomCoinsToSteal
					);
					target.emit(UPDATE_COINS, victimCoinRemove);

					let thiefCoinsGain = PlayerStore.incrementValueBy(
						socket.id,
						'coins',
						randomCoinsToSteal + powerup.coins
					);
					socket.emit(UPDATE_COINS, thiefCoinsGain);
				}
				break;
			case 'setback':
				let setbackScore = 5;
				let targetPlayerScore = PlayerStore.find(target.id);

				if (targetPlayerScore.player.score < setbackScore)
					setbackScore = targetPlayerScore.player.score;
				if (setbackScore == 0)
					return socket.emit(
						ERROR_OCCURRED,
						'The victim already has a score of zero.'
					);

				let playerScore = PlayerStore.decrementValueBy(
					target.id,
					'score',
					setbackScore
				);
				target.emit(UPDATE_SCORE, playerScore);
				break;
		}

		socket.emit(POWERUP_USED, powerup.name);
	};
}
