import instance from './instance';

/**
 * Send a request to the API
 * @param {string} uri The URI to send the request to
 * @param {string} method The HTTP method to use to access the API
 * @param {object} data The data to send to the API if any
 * @returns {promise: {status: number, response: object}} The status code and the response from the API
 */
export default async function request(
	uri: string,
	method: string,
	data: object = {}
): Promise<{ status: number; response: any } | { status: any; response: any }> {
	let requestPromise = await instance
		.request({
			method: method,
			url: uri,
			data: data
		})
		.then((response) => {
			return { status: response.status, response: response.data };
		})
		.catch((error) => {
			return { status: error.response.status, response: error.response.data };
		});

	return requestPromise;
}
