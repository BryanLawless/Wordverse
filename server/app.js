const cors = require('cors');
const express = require('express');
const router = require('./router');
const passport = require('passport');
const pkg = require('./package.json');
const config = require('./config/Config');
const httpStatus = require('http-status');
const cookieParser = require('cookie-parser');
const database = require('./database/Database');
const WordGenerator = require('./modules/words/Generate');

const app = express();

app.disable('x-powered-by');

app.use(cors({
	credentials: true,
	origin: config.CLIENT_URL,
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE'],
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))

database.Connect();

app.use(passport.initialize());
require('./config/Passport')(passport);

app.use('/api', router);

app.use('', (req, res) => {
	res.status(httpStatus.OK).send(`Wordverse v(${pkg.version}) API active.`);
});

WordGenerator.loadWords().then(() => {
	console.log('📜 - Word list has been loaded.');
});

module.exports = app;
