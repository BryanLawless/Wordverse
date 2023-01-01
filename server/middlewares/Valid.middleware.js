const httpStatus = require('http-status');
const responseHandler = require('../helpers/Response');

function check(schema, property) {
	return (req, res, next) => {
		const options = {
			abortEarly: false,
			allowUnknown: true,
			stripUnknown: true,
		}

		const { error } = schema.validate(req[property], options);
		if (error) {
			const { details } = error;
			const validateError = details.map(i => i.message).join(',');

			return responseHandler.sendResponse(res, httpStatus.UNPROCESSABLE_ENTITY, validateError);
		}

		next();
	}
}

module.exports = check;