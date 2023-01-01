const config = require('./Config');
const UserRepo = require('../repository/User.repo');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const jwtOptions = {
	passReqToCallback: true,
	secretOrKey: config.JWT.SIGNING_SECRET,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

module.exports = passport => {
	passport.use(new JwtStrategy(jwtOptions, async (req, payload, done) => {
		try {
			const authorization = typeof req.headers.authorization !== 'undefined' ? req.headers.authorization.split(' ') : [];
			if (typeof authorization[1] === 'undefined') return done(null, false);

			const user = await UserRepo.findByUuid(payload.sub);
			if (!user) return done(null, false);

			done(null, user);
		} catch (error) {
			done(error, false);
		}
	}));
}