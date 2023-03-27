const fs = require("fs");
const path = require("path");

let wordList = [];

/**
 * Load the words from the words.txt file
 */
const loadWords = async () => {
	let wordBuffer = await fs.promises.readFile(
		path.join(__dirname, "./words.txt")
	);
	let data = wordBuffer.toString();

	wordList = data.split(",");
};

/**
 * Generate a random word based on the difficulty level
 * @param {String} level The difficulty level of the word to return
 * @returns {String} A random word based on the difficulty level
 */
const RandomWord = (level = "easy") => {
	let wordLength = 5;
	switch (level) {
		case "easy":
			wordLength = 5;
			break;
		case "medium":
			wordLength = 6;
			break;
		case "hard":
			wordLength = 7;
			break;
	}

	let foundWords = wordList.filter((word) => word.length == wordLength);
	if (foundWords.length == 0)
		throw new Error("no words with specified difficulty length found");

	let randomIndex = Math.floor(Math.random() * foundWords.length);

	return foundWords[randomIndex];
};

module.exports = {
	loadWords,
	RandomWord
};
