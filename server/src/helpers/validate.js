/**
 * Validate the data against the provided schema
 * @param {Object} data The data to validate
 * @param {Object} schema The schema to validate the data against
 * @returns {Object: {status: Boolean, error: String}} The status of the validation and the error message
 */
const Validate = (data, schema) => {
	const { error } = schema.validate(data);
	if (typeof error == "undefined") return { status: true, error: null };

	const { details } = error;
	const validateError = details.map((i) => i.message).join(",");

	return { status: false, error: validateError };
};

module.exports = {
	Validate
};
