import { ObjectSchema } from 'joi';

interface Validation {
	status: boolean;
	error: string;
}

/**
 * Validate the data against the provided schema
 * @param {object} data The data to validate
 * @param {ObjectSchema} schema The schema to validate the data against
 * @returns {object: {status: boolean, error: string}} The status of the validation and the error message
 */
function validate(data: object, schema: ObjectSchema): Validation {
	const { error } = schema.validate(data);
	if (typeof error == 'undefined') return { status: true, error: null };

	const { details } = error;
	const validateError = details.map((i) => i.message).join(',');

	return { status: false, error: validateError };
}

export default validate;
