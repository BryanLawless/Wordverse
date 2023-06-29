import mongoose from 'mongoose';
import { DB } from '../config/config.js';

async function connect() {
	try {
		await mongoose.connect(DB.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		} as mongoose.ConnectOptions);

		console.log('🟢 - MongoDB connected');
	} catch (error) {
		console.log(`Unable to connect to database: ${error.message}`);
		process.exit(1);
	}
}

mongoose.connection.on('reconnected', () => {
	console.log('🔵 - MongoDB reconnected');
});

mongoose.connection.on('disconnected', () => {
	console.log('🟡 - MongoDB disconnected');
});

mongoose.connection.on('close', () => {
	console.log('🔴 - MongoDB connection closed');
});

mongoose.connection.on('error', (error) => {
	console.log(`🐛 - MongoDB error: ${error}`);
	process.exit(1);
});

mongoose.set('strictQuery', true);

export default {
	connect
};
