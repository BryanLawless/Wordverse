const mongoose = require('mongoose');

const Users = mongoose.Schema({
	user_uuid: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	username: {
		type: String,
		required: true,
		unique: false,
		trim: true,
	},
	password: {
		type: String,
		required: true,
		unique: false,
		trim: true,
	}
});

module.exports = mongoose.model('Users', Users);