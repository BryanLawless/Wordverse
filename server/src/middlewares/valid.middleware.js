const httpStatus = require("http-status");
const responseHandler = require("../helpers/response");

/**
 * Validate the data against the provided schema
 * @param {Object} schema The schema to validate the data against 
 * @param {String} property The section of the request to validate
 */
function check(schema, property) {
	return (req, res, next) => {
		const options = {
			abortEarly: false,
			allowUnknown: true,
			stripUnknown: true
		};

		const { error } = schema.validate(req[property], options);
		if (error) {
			const { details } = error;
			const validateError = details.map((i) => i.message).join(",");

			responseHandler.sendResponse(
				res,
				httpStatus.UNPROCESSABLE_ENTITY,
				validateError
			);

			return;
		}

		next();
	};
}

module.exports = check;
