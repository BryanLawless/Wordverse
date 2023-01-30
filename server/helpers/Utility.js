const randomString = (length) => {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

const isNumeric = (id) => {
	return typeof (id) === 'number';
}

const delay = (ms) => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), ms);
	}, ms);
}

const millisToSeconds = (millis) => {
	return Math.floor(millis / 1000);
}

const secondsToMillis = (seconds) => {
	return Math.floor(seconds * 1000);
}

const shuffle = (word) => {
	let chunks = word.split('');

	for (let i = chunks.length - 1; i > 0; i--) {
		let shuffler = Math.floor(Math.random() * (i + 1));
		let temp = chunks[i];

		chunks[i] = chunks[shuffler];
		chunks[shuffler] = temp;
	}

	return chunks.join('');
}

const randomNumberBetween = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
	randomString,
	isNumeric,
	delay,
	millisToSeconds,
	secondsToMillis,
	shuffle,
	randomNumberBetween
}