const Validate = (data, schema) => {
	const { error } = schema.validate(data)
	if (typeof error == 'undefined') return { status: true, error: null }

	const { details } = error;
	const validateError = details.map(i => i.message).join(',');

	return { status: false, error: validateError }
}

module.exports = {
	Validate
}