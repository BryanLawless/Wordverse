/**
 * Send a response to the client
 * @param {Object} res The response object
 * @param {Integer} statusCode The status code to send
 * @param {String} message The message to send
 * @param {Object} data The data to send
 */
const sendResponse = (res, statusCode, message, data = {}) => {
	let status = (statusCode >= 200 && statusCode < 300);

	res
		.status(statusCode)
		.json({ code: statusCode, status: status, message, data });
};

/**
 * Send data from the service to the controller
 * @param {String} event Event name
 * @param {Object} data Data to send
 * @returns {object} The event and data
 */
const serviceToController = (event, data = {}) => {
	return { event, data };
};

module.exports = {
	sendResponse,
	serviceToController
};
