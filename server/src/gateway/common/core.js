const axios = require("axios");

/**
 * Get the definition of a word
 * @param {String} word The word to get the definition of
 * @returns {String|Boolean} The definition of the word or false if the word definition cant be found
 */
const getDefinition = async (word) => {
	try {
		const response = await axios.get(
			`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
			{
				timeout: 1500
			}
		);

		return response.data[0].meanings[0].definitions[0].definition;
	} catch (error) {
		return false;
	}
};

/**
 * Generate a voice connection payload for Twilio
 * @param {Object} twilio The Twilio client
 * @returns {Object|Boolean} The voice credential payload or false if the payload cant be generated
 */
const generateVoicePayload = async (twilio) => {
	let payload = {};

	/* Create a Twilio payload to later send to the client */
	token = await twilio.tokens.create()
	payload.username = token.username;
	payload.credential = token.password;

	return (payload) ? payload : false;
};

module.exports = {
	getDefinition,
	generateVoicePayload
};
