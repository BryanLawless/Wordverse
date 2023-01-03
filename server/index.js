require('dotenv').config();

const http = require('http');
const app = require('./app');
const socketServer = require('./gateway/Main');

const server = http.createServer(app);
socketServer.registerSocketServer(server);

server.listen(process.env.PORT || 5000, '0.0.0.0', () => {
	console.log('💾 - Words Hurt server started.');
});