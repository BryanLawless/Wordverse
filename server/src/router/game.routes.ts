import { Router } from 'express';
import GameController from '../controllers/game.controller.js';

/* Access router instance */
const router = Router();

/* Assign methods to routes */
router.get('/get/:amount', GameController.fetch);
router.get('/info/:gameId', GameController.info);
router.get('/players/:gameId', GameController.players);
router.get('/leaderboard/:gameId', GameController.leaderboard);

export default router;
