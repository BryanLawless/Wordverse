import instance from "./instance";

/**
 * Send a request to the API
 * @param {String} uri The URI to send the request to
 * @param {String} method The HTTP method to use to access the API
 * @param {Object} data The data to send to the API if any
 * @returns {Promise: {status: Integer, response: Object}} The status code and the response from the API
 */
export default async function request(uri, method, data = {}) {
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
