import httpStatus from 'http-status';
import { ObjectSchema } from 'joi';
import { sendResponse } from '../util/response.js';
import { Request, Response, NextFunction } from 'express';

const options = {
	abortEarly: false,
	allowUnknown: true,
	stripUnknown: true
};

/**
 * Validate the data against the provided schema
 * @param {object} schema The schema to validate the data against
 * @param {string} property The section of the request to validate
 */
function check(schema: ObjectSchema, property: string): Function {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error } = schema.validate(req[property], options);
		if (error) {
			const { details } = error;
			const validateError = details.map((i) => i.message).join(',');

			sendResponse(res, httpStatus.UNPROCESSABLE_ENTITY, validateError);

			return;
		}

		next();
	};
}

export default check;
