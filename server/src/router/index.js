const express = require("express");

/* Access router instance */
const router = express.Router();

/* Establish all route sections */
const defaultRoutes = [
	{
		path: "/",
		route: require("./general.routes")
	},
	{
		path: "/games",
		route: require("./game.routes")
	}
];

/* Add all routes to the router */
defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;
