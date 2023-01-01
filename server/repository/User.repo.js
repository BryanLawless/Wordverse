const userModel = require('../schemas/models/User.model');

class UserRepo {
	constructor() {
		this.userModel = userModel
	}

	findByEmail = async (email) => {
		return this.userModel.findOne({ email: email }).then((result) => {
			return result;
		});
	}

	findByUuid = async (uuid) => {
		return this.userModel.findOne({ user_uuid: uuid }).then((result) => {
			return result;
		});
	}

	createUser = async (user) => {
		return this.userModel.create({
			user_uuid: user.user_uuid,
			email: user.email,
			username: user.username,
			password: user.password
		});
	}
}

module.exports = new UserRepo();
