import { Router } from 'express';
import gameRoutes from './game.routes.js';
import generalRoutes from './general.routes.js';

/* Access router instance */
const router: Router = Router();

/* Establish all route sections */
const defaultRoutes = [
	{
		path: '/',
		route: generalRoutes
	},
	{
		path: '/games',
		route: gameRoutes
	}
];

/* Add all routes to the router */
defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

export default router;
