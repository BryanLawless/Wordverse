const express = require('express');

const router = express.Router();

const defaultRoutes = [
	{
		path: '/',
		route: require('./General.routes'),
	},
	/*{
		path: '/auth',
		route: require('./Auth.routes'),
	},*/
	{
		path: '/games',
		route: require('./Game.routes'),
	},
	/*{
		path: '/users',
		route: require('./User.routes'),
	}*/
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;