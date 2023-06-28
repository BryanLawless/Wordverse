import dotenv from 'dotenv';

/* Load Environment variables */
dotenv.config();

/* Essential configurations */
export const CLIENT_URL = process.env.CLIENT_URL;
export const DB = { MONGO_URI: process.env.MONGO_URI };
export const VOICE = {
	TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
	TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN
};
