module.exports = {
	CLIENT_URL: process.env.CLIENT_URL,
	DB: {
		MONGO_URI: process.env.MONGO_URI,
	},
	JWT: {
		TOKEN_EXPIRE_DAYS: 30,
		SIGNING_SECRET: process.env.JWT_SIGNING_SECRET,
	}
}