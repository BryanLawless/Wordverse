import axios from 'axios';
import { Twilio } from 'twilio';
import { CredentialPayload } from '../../types/misc.types.js';

/**
 * Get the definition of a word
 * @param {string} word The word to get the definition of
 * @returns {string|boolean} The definition of the word or false if the word definition cant be found
 */
export async function getDefinition(word: string): Promise<string | boolean> {
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
}

/**
 * Generate a voice connection payload for Twilio
 * @param {object} twilio The Twilio client
 * @returns {object|boolean} The voice credential payload or false if the payload cant be generated
 */
export async function generateVoicePayload(
	twilio: Twilio
): Promise<CredentialPayload | boolean> {
	/* Create a Twilio payload to later send to the client */
	const token = await twilio.tokens.create();
	const credentials: CredentialPayload = {
		username: token.username,
		credential: token.password
	};

	return credentials ? credentials : false;
}
