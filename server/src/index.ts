import cors from 'cors';
import { createServer } from 'http';
import httpStatus from 'http-status';
import router from './router/index.js';
import cookieParser from 'cookie-parser';
import { CLIENT_URL } from './config/config.js';
import database from './database/database.js';
import registerSocketServer from './gateway/main.js';
import express, { Express, Request, Response, json } from 'express';
import { loadWords, loadPictionaryWords } from './modules/words/index.js';

/* Create new express app */
const app: Express = express();

/* Create a new HTTP server */
const server = createServer(app);

/* Disable x-powered-by header for security reasons */
app.disable('x-powered-by');

/* Enable CORS for API requests */
app.use(
	cors({
		credentials: true,
		origin: CLIENT_URL,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE']
	})
);

/* Enable JSON and cookie usage with express */
app.use(json());
app.use(cookieParser());

/* Connect to the database */
database.connect();

/* Register the main API router */
app.use('/api', router);

/* Register the socket server */
registerSocketServer(server);

/* Register the root version endpoint. TODO: Replace with health check */
app.use('', (req: Request, res: Response) => res.sendStatus(httpStatus.OK));

/* Preload the Word Generator */
loadWords().then(() => console.log('✅ - Scramble word list has been loaded'));
loadPictionaryWords().then(() =>
	console.log('✅ - Pictionary word list has been loaded')
);

/* Start server on default port or 127.0.0.1:5000 */
server.listen(Number(process.env.PORT) || 5000, (): void => {
	console.log('🪐 - Wordverse server started');
});
