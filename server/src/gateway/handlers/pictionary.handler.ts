import { Server } from 'socket.io';
import ChatHandler from './chat.handler.js';
import { Line } from '../../types/game.types.js';
import GameStore from '../../stores/game.store.js';
import { Player } from '../../types/player.types.js';
import PlayerStore from '../../stores/player.store.js';
import { TimedPromise } from '../../types/extend.types.js';
import { SocketExtended } from '../../types/extend.types.js';
import { randomPictionaryWords } from '../../modules/words/index.js';
import { delay, secondsToMillis } from '../../util/util.js';

import {
	EMIT_DRAWING,
	DRAW_LINE,
	CLEAR_CANVAS,
	UNDO_LINE,
	YOUR_TURN,
	END_TURN,
	SET_TIMER,
	POSSIBLE_DRAWING_OPTIONS,
	CHOOSE_WORD,
	CORRECT_WORD,
	WORD_CHOSEN,
	GUESS_DRAWING,
	CORRECT_GUESS,
	INCORRECT_GUESS,
	TURN_ROTATION,
	GAME_OVER,
	UPDATE_SCORE,
	ROUND,
	ERROR_OCCURRED
} from '../events.js';
import playerStore from '../../stores/player.store.js';

export default class PictionaryHandler {
	io: any;
	gameId: string;
	hostSocket: any;
	events: object;
	timePerPlayer: number;
	pickWordTime: number;
	rounds: number;
	currentRound: number;
	threeWords: Array<string>;
	wordPickTimer: TimedPromise;
	wordPickTimestamp: Date;
	playerTurnTimer: TimedPromise;
	playerTurnTimestamp: Date;
	drawingWord: string;
	currentDrawerSocket: string;

	constructor(io: Server, hostSocket: SocketExtended) {
		this.io = io;
		this.gameId = '';
		this.hostSocket = hostSocket;

		/* Duration of time to draw per player in seconds */
		this.timePerPlayer = 60;

		/* Duration of time to pick a word in seconds */
		this.pickWordTime = 10;

		/* The amount of rounds to play, once all players have had a turn, it is a round */
		this.rounds = 5;

		/* The current round of the game */
		this.currentRound = 1;

		/* The current players three words to choose from for their turn */
		this.threeWords = [];

		/* The word that is currently being drawn */
		this.drawingWord = '';

		this.events = {
			[EMIT_DRAWING]: this.emitDrawing,
			[CLEAR_CANVAS]: this.clearCanvas,
			[UNDO_LINE]: this.undoLine,
			[CHOOSE_WORD]: this.chooseWord,
			[GUESS_DRAWING]: this.guessDrawing
		};
	}

	init = async () => {
		/* Get the game by the host socket id */
		let { game_id } = GameStore.getGameByHost(this.hostSocket.id);

		/* Set the game id */
		this.gameId = game_id;

		/* Loop through current players in the game and dynamically add event listeners */
		const sockets = await this.io.in(this.gameId).fetchSockets();
		for (let socket of sockets) {
			for (let [event, callback] of Object.entries(this.events)) {
				let possibleEvent = socket._events[event];
				if (typeof possibleEvent === 'undefined' || possibleEvent === null)
					socket.on(event, (data: any) => callback(socket, data));
			}
		}

		this.startPlayerTurn();
	};

	/**
	 * Main handler for the game flow
	 */
	private startPlayerTurn = async () => {
		/* Check if the round limit has been reached, if so, end the game */
		if (this.currentRound > this.rounds) {
			this.io.to(this.gameId).emit(GAME_OVER);
			return;
		}

		/* Hacky temp fix */
		if (PlayerStore.all(this.gameId).length == 1) {
			this.io.to(this.gameId).emit(ERROR_OCCURRED, 'No more players.');
			this.io.to(this.gameId).emit(GAME_OVER);
			return;
		}

		/* Get the next player in the turn order */
		let nextPlayerIndex = GameStore.getNextTurnPlayerIndex(this.gameId);
		let nextPlayer: Player = PlayerStore.all(this.gameId)[nextPlayerIndex];

		/* Toggle player turn and send the player that it is their turn */
		PlayerStore.toggleTurn(nextPlayer.player_socket);
		this.io.to(nextPlayer.player_socket).emit(YOUR_TURN);

		/* Set the current drawer socket */
		this.currentDrawerSocket = nextPlayer.player_socket;

		/* Get three random words from the pictionary words list */
		this.threeWords = randomPictionaryWords();

		/* Send the three words to the player */
		this.io.to(nextPlayer.player_socket).emit(POSSIBLE_DRAWING_OPTIONS, {
			words: this.threeWords
		});

		/* Toggle the choosing state for the player */
		PlayerStore.toggleChoosing(nextPlayer.player_socket);

		/* Broadcast that a the player is choosing a word */
		ChatHandler.sendMessageAsServer(
			this.io,
			this.gameId,
			`${nextPlayer.nickname} is choosing a word`
		);

		/* Start word selection time limit for player */
		this.wordPickTimestamp = new Date();
		this.wordPickTimestamp.setSeconds(
			this.wordPickTimestamp.getSeconds() + this.pickWordTime
		);

		/* Send the current turn timestamp to all players */
		this.io
			.to(this.gameId)
			.emit(SET_TIMER, this.wordPickTimestamp.toUTCString());

		/* Have player with next turn select a word, ten second limit */
		this.wordPickTimer = delay(
			secondsToMillis(this.pickWordTime),
			nextPlayer.player_socket
		);

		/* Add the timer to the game store */
		GameStore.addTimer(this.gameId, this.wordPickTimer);

		/* Wait for the word pick timer to finish */
		await this.wordPickTimer;

		/* Remove the timer from the timers object */
		GameStore.removeTimer(this.gameId, this.wordPickTimer);

		/* Toggle the choosing state for the player */
		PlayerStore.toggleChoosing(nextPlayer.player_socket);

		/* Check if the player has not chosen a word, randomly choose three words */
		if (this.drawingWord.length === 0) {
			this.drawingWord =
				this.threeWords[Math.floor(Math.random() * this.threeWords.length)];
		}

		/* Send selected word to player */
		this.io.to(nextPlayer.player_socket).emit(WORD_CHOSEN, this.drawingWord);

		/* Start timer for player */
		this.playerTurnTimestamp = new Date();
		this.playerTurnTimestamp.setSeconds(
			this.playerTurnTimestamp.getSeconds() + this.timePerPlayer
		);

		/* Send the current turn timestamp to all players */
		this.io
			.to(this.gameId)
			.emit(SET_TIMER, this.playerTurnTimestamp.toUTCString());

		/* Wait until turn is finished, and then start the next turn */
		this.playerTurnTimer = delay(
			secondsToMillis(this.timePerPlayer),
			nextPlayer.player_socket
		);

		/* Add the timer to the game store */
		GameStore.addTimer(this.gameId, this.playerTurnTimer);

		this.playerTurnTimer.then((proceed) => {
			if (!proceed) return;

			/* Broadcast to all players that the turn has ended, show the correct word */
			this.io.to(this.gameId).emit(CORRECT_WORD, this.drawingWord);

			/* End the turn for the player */
			PlayerStore.toggleTurn(nextPlayer.player_socket);
			this.io.to(nextPlayer.player_socket).emit(END_TURN);

			/* Reset all correct guesses */
			PlayerStore.resetAllCorrectGuesses(this.gameId);

			/* Reset the drawing word */
			this.drawingWord = '';

			/* Clear the canvas */
			this.clearCanvasHandler(
				this.io.sockets.sockets.get(nextPlayer.player_socket),
				true
			);

			/* Remove the timer from the timers object */
			GameStore.removeTimer(this.gameId, this.playerTurnTimer);

			/* Broadcast the turn rotation */
			this.io.to(this.gameId).emit(TURN_ROTATION);

			/* Increment the round after all previous players have had a turn */
			if (nextPlayerIndex === PlayerStore.all(this.gameId).length - 1) {
				this.currentRound++;

				/* Send the current round to all players */
				this.io.to(this.gameId).emit(ROUND, this.currentRound);
			}

			/* Run the next turn */
			this.startPlayerTurn();
		});
	};

	/**
	 * Allows the player to choose a word from the three words they are given
	 * @param {SocketExtended} socket Socket instance from the current connection
	 * @param {number} data The index of the word the player has chosen
	 */
	private chooseWord = async (socket: SocketExtended, data: number) => {
		const player = PlayerStore.find(socket.id);

		if (!PlayerStore.isTurn(socket.id)) return;
		if (!player.player.choosing) return;
		if (data < 0 || data > 2) return;

		this.drawingWord = this.threeWords[data];

		this.wordPickTimer.cancelCompletePromise();
	};

	/**
	 * Guess the word that the player is drawing
	 * @param {SocketExtended} socket Socket instance from the current connection
	 * @param {string} data The word the player has guessed
	 */
	private guessDrawing = async (socket: SocketExtended, data: string) => {
		const player = PlayerStore.find(socket.id).player;

		/* If the player is currently drawing, return */
		if (playerStore.isTurn(socket.id)) return;

		/* Check if the player has already guessed the word correctly */
		if (player.correct_guess) return;

		/* Check if the word is correct */
		if (data.toLowerCase() === this.drawingWord.toLowerCase()) {
			/* Send CORRECT_GUESS event to player */
			socket.emit(CORRECT_GUESS);

			/* Calculate the score to give to the guesser based on the time remaining */
			const guessedTime = new Date();
			const guesserScoreCalculated = Math.round(
				(this.playerTurnTimestamp.getTime() - guessedTime.getTime()) / 1000 / 2
			);

			/* Increment the guessers score */
			const guesserScore = PlayerStore.incrementValueBy(
				player.player_socket,
				'score',
				guesserScoreCalculated
			);

			/* Calculate the score to give to the drawer based on the guesser score */
			let drawerScoreCalculated: number = 0;
			switch (true) {
				case guesserScoreCalculated >= 1:
					drawerScoreCalculated = 1;
				case guesserScoreCalculated >= 10:
					drawerScoreCalculated = 5;
				case guesserScoreCalculated >= 20:
					drawerScoreCalculated = 10;
			}

			/* Increment the drawers score */
			const drawerScore = PlayerStore.incrementValueBy(
				this.currentDrawerSocket,
				'score',
				drawerScoreCalculated
			);

			/* Send the guessers score */
			socket.emit(UPDATE_SCORE, guesserScore);

			/* Send the drawers score */
			this.io.to(this.currentDrawerSocket).emit(UPDATE_SCORE, drawerScore);

			/* Set the player's correct guess to true */
			PlayerStore.modify(socket.id, 'correct_guess', true);

			/* Display a player has guessed the word correctly in chat */
			ChatHandler.sendMessageAsServer(
				this.io,
				this.gameId,
				`${player.nickname} guessed the word correctly!`
			);

			/* Check if all players have guessed the word correctly, if so, next turn */
			if (PlayerStore.allGuessedCorrectly(this.gameId))
				this.playerTurnTimer.cancelCompletePromise();
		} else {
			/* Display the guess in chat */
			ChatHandler.sendMessageAsServer(
				this.io,
				this.gameId,
				`${player.nickname} guessed ${data}`
			);

			/* Send INCORRECT_GUESS event to player */
			socket.emit(INCORRECT_GUESS);
		}
	};

	/**
	 * Emit all new drawing data to all players
	 * @param {SocketExtended} socket Socket instance from the current connection
	 * @param {Line} data The line data to emit to all players
	 */
	private emitDrawing = async (socket: SocketExtended, data: Line) => {
		if (!PlayerStore.isTurn(socket.id)) return;

		GameStore.addLine(this.gameId, data);

		socket.broadcast.to(this.gameId).emit(DRAW_LINE, data);
	};

	/**
	 * Clear the canvas for all players
	 * @param {SocketExtended} socket Socket instance from the current connection
	 */
	private clearCanvas = async (socket: SocketExtended) => {
		if (!PlayerStore.isTurn(socket.id)) return;

		this.clearCanvasHandler(socket, false);
	};

	/**
	 * The main handler for clearing the canvas for players
	 * @param {SocketExtended} socket Socket instance from the current connection
	 * @param {boolean} everyone Clear the canvas for everyone except the current player or everyone
	 */
	private clearCanvasHandler = async (
		socket: SocketExtended,
		everyone: boolean
	) => {
		GameStore.set(this.gameId, 'lines', []);

		if (everyone) {
			this.io.to(this.gameId).emit(CLEAR_CANVAS);
		} else {
			socket.broadcast.to(this.gameId).emit(CLEAR_CANVAS);
		}
	};

	/**
	 * Undo the last line drawn for all players
	 * @param {SocketExtended} socket Socket instance from the current connection
	 */
	private undoLine = async (socket: SocketExtended) => {
		if (!PlayerStore.isTurn(socket.id)) return;

		GameStore.undoLine(this.gameId, 15);

		socket.broadcast.to(this.gameId).emit(UNDO_LINE);
	};
}
