const httpStatus = require('http-status');
const Token = require('../helpers/Token');
const { sendResponse } = require('../helpers/Response');
const AuthService = require('../services/Auth.service');

class AuthController {
	constructor() {
		this.authService = new AuthService();
	}

	register = async (req, res) => {
		const { event, data } = await this.authService.createUser(req, res);

		switch (event) {
			case 'ERR_EMAIL_ALREADY_EXISTS':
				return sendResponse(res, httpStatus.CONFLICT, "Email already exists.");
			case 'ERR_REGISTER_FAILED':
				return sendResponse(res, httpStatus.BAD_REQUEST, "Registration Failed.");
			case 'SUCCESS_REGISTER':
				return sendResponse(res, httpStatus.OK, "Account created successfully!", data);
		}
	}

	login = async (req, res) => {
		const { event, data } = await this.authService.loginWithEmailPassword(req, res);

		switch (event) {
			case 'ERR_EMAIL_NOT_FOUND':
				return sendResponse(res, httpStatus.NOT_FOUND, "User not found.");
			case 'ERR_PASSWORD_INCORRECT':
				return sendResponse(res, httpStatus.UNAUTHORIZED, "Password incorrect.");
			case 'SUCCESS_LOGIN':
				return sendResponse(res, httpStatus.OK, "Login successful!", data);
		}
	}

	logout = async (req, res) => {
		const { event, data } = await this.authService.logout(req, res);

		switch (event) {
			case 'ERR_LOGOUT_FAILED':
				return sendResponse(res, httpStatus.BAD_REQUEST, "Logout failed.");
			case 'SUCCESS_LOGOUT':
				return sendResponse(res, httpStatus.OK, "Logout successful!", { data });
		}
	}
}

module.exports = AuthController;
