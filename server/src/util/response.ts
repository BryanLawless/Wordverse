import { Response } from 'express';

export interface ServiceToController {
	event: string;
	data: object;
}

/**
 * Send a response to the client
 * @param {Response} res The response object
 * @param {number} statusCode The status code to send
 * @param {string} message The message to send
 * @param {object} data The data to send
 */
export function sendResponse(
	res: Response,
	statusCode: number,
	message: string,
	data: object = {}
) {
	let status = statusCode >= 200 && statusCode < 300;

	res
		.status(statusCode)
		.json({ code: statusCode, status: status, message, data });
}

/**
 * Send data from the service to the controller
 * @param {string} event Event name
 * @param {object} data Data to send
 * @returns {object} The event and data
 */
export function serviceToController(
	event: string,
	data: object = {}
): ServiceToController {
	return { event: event, data: data };
}
