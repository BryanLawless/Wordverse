const sendResponse = (res, statusCode, message, data = {}) => {
	let status = false;
	if (statusCode >= 200 && statusCode < 300) {
		status = true;
	}

	res.status(statusCode).json({ code: statusCode, status: status, message, data });
}

const serviceToController = (event, data = {}) => {
	return { event, data };
}

module.exports = {
	sendResponse,
	serviceToController
}