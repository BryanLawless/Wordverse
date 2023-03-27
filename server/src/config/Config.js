/* Essential Configurations */
module.exports = {
	CLIENT_URL: process.env.CLIENT_URL,
	DB: {
		MONGO_URI: process.env.MONGO_URI
	},
	VOICE: {
		TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
		TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN
	}
};
