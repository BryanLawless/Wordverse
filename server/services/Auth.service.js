const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const Token = require('../helpers/Token');
const UserRepo = require('../repository/User.repo');
const TokenRepo = require('../repository/Token.repo');
const { serviceToController } = require('../helpers/Response');

class AuthService {

	loginWithEmailPassword = async (req, res) => {
		let { email, password } = req.body;

		let user = await UserRepo.findByEmail(email);
		if (user === null) {
			return serviceToController('ERR_EMAIL_NOT_FOUND');
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		user = user.toJSON();
		delete user.password;

		if (!isPasswordValid) return serviceToController('ERR_PASSWORD_INCORRECT');

		let auth = await Token.generateToken(user.user_uuid);
		await TokenRepo.saveToken(user.user_uuid, auth.token, false, auth.expires)

		return serviceToController('SUCCESS_LOGIN', { user, auth });
	}

	createUser = async (req, res) => {
		let { email, username, password } = req.body;

		if (await UserRepo.findByEmail(email) !== null) return serviceToController('ERR_EMAIL_ALREADY_EXISTS');

		let userData = await UserRepo.createUser({
			user_uuid: uuidv4(),
			username: username,
			email: email.toLowerCase(),
			password: bcrypt.hashSync(password, 8)
		});

		if (!userData) return serviceToController('ERR_REGISTER_FAILED');

		delete userData.password;
		let user = userData.toJSON();

		let auth = await Token.generateToken(user.user_uuid);
		await TokenRepo.saveToken(user.user_uuid, auth.token, false, auth.expires);

		return serviceToController('SUCCESS_REGISTER', { user, auth });
	}

	logout = async (req, res) => {
		const refreshTokenDoc = await TokenRepo.findOne({
			token: req.body.refresh_token,
			blacklisted: false,
		});

		if (!refreshTokenDoc) {
			return serviceToController('ERR_LOGOUT_FAILED');
		}

		await TokenRepo.deleteToken({
			refresh_token: req.body.refresh_token,
			blacklisted: false,
		});

		return serviceToController('SUCCESS_LOGOUT');
	}
}

module.exports = AuthService;
