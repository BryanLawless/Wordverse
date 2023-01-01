const mongoose = require('mongoose');

const Tokens = mongoose.Schema({
	user_uuid: {
		type: String,
		required: true,
		unique: false,
		trim: true
	},
	token: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	blacklisted: {
		type: Boolean,
		required: true,
		unique: false,
		trim: false,
	},
	expires: {
		type: Date,
		required: true,
		unique: false,
		trim: true,
	}
});

module.exports = mongoose.model('Tokens', Tokens);