const tokenModel = require('../schemas/models/Token.model');

class TokenRepo {
	constructor() {
		this.tokenModel = tokenModel
	}

	findOne = async (query) => {
		return this.tokenModel.findOne(query).then((result) => {
			return result;
		});
	}

	saveToken = async (uuid, token, blacklisted, expires) => {
		return this.tokenModel.create({
			user_uuid: uuid,
			token: token,
			blacklisted: blacklisted,
			expires: expires,
		});
	}

	deleteToken = async (query) => {
		return this.tokenModel.deleteOne(query);
	}
}

module.exports = new TokenRepo();

