import { TimedPromise } from '../types/extend.types.js';

/**
 * Generate a random string based on a length
 * @param {number} length The length of the string to generate
 * @returns {string} The generated string
 */
export function randomString(length: number): string {
	var result = '';
	var characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

/**
 * Check if a value is numeric
 * @param {any} raw The raw value to check
 * @returns {boolean} True if the value is numeric
 */
export function isNumeric(raw: any): boolean {
	return typeof raw === 'number';
}

/**
 * Delay program execution for a specific amount of milliseconds
 * @param {number} ms The amount of milliseconds to delay
 * @param {string} belongs What the delay belongs to
 * @returns {TimedPromise} The promise and delay instance
 */
export function delay(ms: number, belongs: string): TimedPromise {
	let timer: NodeJS.Timeout, endTimer: Function;

	class TimedPromise extends Promise<any> {
		isCanceled: boolean = false;
		belongs: string = belongs;
		started: Date = new Date();

		constructor(fn) {
			super(fn);
		}

		cancelCompletePromise = () => {
			endTimer(true);
			clearTimeout(timer);
			this.isCanceled = true;
		};

		cancelRejectPromise = () => {
			endTimer(false);
			clearTimeout(timer);
			this.isCanceled = true;
		};
	}

	return new TimedPromise((resolve: Function) => {
		endTimer = resolve;
		timer = setTimeout(() => endTimer(true), ms);
	});
}

/**
 * Convert milliseconds to seconds
 * @param {Number} millis The amount of milliseconds to convert to seconds
 * @returns {Number} The amount of seconds rounded from the milliseconds
 */
export function millisToSeconds(millis: number): number {
	return Math.floor(millis / 1000);
}

/**
 * Convert seconds to milliseconds
 * @param {Number} seconds The amount of seconds to convert to milliseconds
 * @returns {Number} The amount of milliseconds rounded from the seconds
 */
export function secondsToMillis(seconds: number): number {
	return Math.floor(seconds * 1000);
}

/**
 * Fisher-Yates shuffling algorithm for a word https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 * @param {String} word The word to shuffle
 * @returns {String} The shuffled word
 */
export function shuffle(word: string): string {
	let chunks = word.split('');

	for (let i = chunks.length - 1; i > 0; i--) {
		let shuffler = Math.floor(Math.random() * (i + 1));
		let temp = chunks[i];

		chunks[i] = chunks[shuffler];
		chunks[shuffler] = temp;
	}

	return chunks.join('');
}

/**
 * Get a random number between a min and max number
 * @param {Number} min The minimum number to generate
 * @param {Number} max The maximum number to generate
 * @returns {Number} The generated number
 */
export function randomNumberBetween(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
