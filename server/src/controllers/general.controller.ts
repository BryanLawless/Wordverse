import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { sendResponse } from '../util/response.js';

class GameController {
	/**
	 * Check if the server is accessible and healthy. TODO: Add more checks.
	 * @param {Request} req Request instance
	 * @param {Response} res Response instance
	 */
	static async health(req: Request, res: Response) {
		sendResponse(res, httpStatus.OK, 'Healthy.');
	}
}

export default GameController;
