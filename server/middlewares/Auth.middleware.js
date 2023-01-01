const passport = require('passport');
const httpStatus = require('http-status');
const { sendResponse } = require('../helpers/Response');

const auth = () => {
	return (req, res, next) => {
		passport.authenticate('jwt', { session: false }, (err, user) => {
			if (err) return next(err);
			if (!user) return sendResponse(res, httpStatus.UNAUTHORIZED, 'Invalid or expired access token.');

			req.user = user;

			return next();
		})(req, res, next);
	}
}

module.exports = auth;