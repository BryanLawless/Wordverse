const axios = require('axios');

const getDefinition = async (word) => {
	try {
		const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
			timeout: 1500
		});

		return response.data[0].meanings[0].definitions[0].definition;
	} catch (error) {
		return false;
	}
}

generateVoiceToken = async (twilio) => {
	return await twilio.tokens.create(function (error, response) {
		if (error) return false;

		return response;
	});
}

module.exports = {
	getDefinition,
	generateVoiceToken
}