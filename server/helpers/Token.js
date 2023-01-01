const moment = require('moment');
const jwt = require('jsonwebtoken');
const config = require('../config/Config');

createToken = (uuid, expires) => {
	return jwt.sign({
		sub: uuid,
		iat: moment().unix(),
		exp: expires.unix(),
	}, config.JWT.SIGNING_SECRET);
}

parseToken = async (token) => {
	const payload = jwt.verify(token, config.JWT.SIGNING_SECRET, (err, decoded) => {
		return { error: (err ? err : false), decoded };
	});

	return payload
}

generateToken = async (userUuid) => {
	const tokenExpires = moment().add(config.JWT.TOKEN_EXPIRE_DAYS, 'days')

	return {
		token: createToken(userUuid, tokenExpires),
		expires: tokenExpires.toDate(),
	}
}

module.exports = {
	parseToken,
	generateToken,
}
