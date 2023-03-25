/**
 * Generate a random string based on a length
 * @param {Integer} length The length of the string to generate
 * @returns {String} The generated string
 */
const randomString = (length) => {
	var result = "";
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

/**
 * Check if a value is numeric
 * @param {Any} raw The raw value to check
 * @returns {Boolean} True if the value is numeric
 */
const isNumeric = (raw) => {
	return typeof raw === "number";
};

/**
 * Delay program execution for a specific amount of milliseconds
 * @param {Integer} ms The amount of milliseconds to delay
 * @returns {Promise} The promise to delay instance
 */
const delay = (ms) => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), ms);
	}, ms);
};

/**
 * Convert milliseconds to seconds
 * @param {Integer} millis The amount of milliseconds to convert to seconds
 * @returns {Integer} The amount of seconds rounded from the milliseconds
 */
const millisToSeconds = (millis) => {
	return Math.floor(millis / 1000);
};

/**
 * Convert seconds to milliseconds
 * @param {Integer} seconds The amount of seconds to convert to milliseconds
 * @returns {Integer} The amount of milliseconds rounded from the seconds
 */
const secondsToMillis = (seconds) => {
	return Math.floor(seconds * 1000);
};

/**
 * Fisher-Yates shuffling algorithm for a word https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 * @param {String} word The word to shuffle
 * @returns The shuffled word
 */
const shuffle = (word) => {
	let chunks = word.split("");

	for (let i = chunks.length - 1; i > 0; i--) {
		let shuffler = Math.floor(Math.random() * (i + 1));
		let temp = chunks[i];

		chunks[i] = chunks[shuffler];
		chunks[shuffler] = temp;
	}

	return chunks.join("");
};

/**
 * Get a random number between a min and max number
 * @param {Integer} min The minimum number to generate
 * @param {Integer} max The maximum number to generate
 * @returns {Integer} The generated number
 */
const randomNumberBetween = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = {
	randomString,
	isNumeric,
	delay,
	millisToSeconds,
	secondsToMillis,
	shuffle,
	randomNumberBetween
};
