import path from 'path';
import { promises } from 'fs';

let wordList = [];
let pictionaryWords = [];

/**
 * Load the words from the words.txt file
 */
export async function loadWords() {
	let wordBuffer = await promises.readFile(
		path.join(path.resolve(), 'src', 'assets', 'words.txt')
	);
	let data = wordBuffer.toString();

	wordList = data.split(',');
}

/**
 * Load the words from the pictionary_words.txt file
 */
export async function loadPictionaryWords() {
	let wordBuffer = await promises.readFile(
		path.join(path.resolve(), 'src', 'assets', 'pictionary.txt')
	);

	let data = wordBuffer.toString();

	pictionaryWords = data.split(',');
}

/**
 * Return three random words from the pictionary words list
 * @returns {string[]} An array of 3 random words from the pictionary words list
 */
export function randomPictionaryWords(): string[] {
	let randomWords = [];

	for (let i = 0; i < 3; i++) {
		let randomIndex = Math.floor(Math.random() * pictionaryWords.length);
		randomWords.push(pictionaryWords[randomIndex]);
	}

	return randomWords;
}

/**
 * Generate a random word based on the difficulty level
 * @param {String} level The difficulty level of the word to return
 * @returns {Promise<string>} A random word based on the difficulty level
 */
export function randomWord(level: string = 'easy'): string {
	let wordLength = 5;
	switch (level) {
		case 'easy':
			wordLength = 5;
			break;
		case 'medium':
			wordLength = 6;
			break;
		case 'hard':
			wordLength = 7;
			break;
	}

	let foundWords = wordList.filter((word) => word.length == wordLength);
	if (foundWords.length == 0)
		throw new Error('no words with specified difficulty length found');

	let randomIndex = Math.floor(Math.random() * foundWords.length);

	return foundWords[randomIndex];
}
