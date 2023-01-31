const mongoose = require('mongoose');
const config = require('../config/Config');

mongoose.connection.on('connected', () => {
	console.log('🟢 - MongoDB connection established.');
});

mongoose.connection.on('reconnected', () => {
	console.log('🔵 - MongoDB connection Re-established.');
});

mongoose.connection.on('disconnected', () => {
	console.log('🟡 - MongoDB connection disconnected.');
});

mongoose.connection.on('close', () => {
	console.log('🔴 - MongoDB connection closed.');
});

mongoose.connection.on('error', (error) => {
	console.log(`🐛 - MongoDB Error: ${error}`);
	process.exit(1);
});

mongoose.set('strictQuery', true);

module.exports = {
	Connect: async () => {
		try {
			mongoose.connect(config.DB.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
		} catch (error) {
			console.log('Ingnorable error (for now): ' + error.message);
		}
	}
};