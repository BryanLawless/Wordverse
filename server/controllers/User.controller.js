const httpStatus = require('http-status');
const { sendResponse } = require('../helpers/Response');
const UserService = require('../services/User.service');

class UserController {
	constructor() {
		this.userService = new UserService();
	}

	me = async (req, res) => {
		let { user_uuid, email, username } = req.user;

		return sendResponse(res, httpStatus.OK, "User data retrieved.", { user_uuid: user_uuid, email: email, username: username });
	}
}

module.exports = UserController;
