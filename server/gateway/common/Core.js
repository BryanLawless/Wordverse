const axios = require('axios');

const getDefinition = async (word) => {
	try {
		const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

		return response.data[0].meanings[0].definitions[0].definition;
	} catch (error) {
		return false;
	}
}

module.exports = {
	getDefinition
}