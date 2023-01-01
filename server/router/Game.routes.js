const express = require('express');
const ValidatorSchema = require('../schemas/Validation.schema');
const Validate = require('../middlewares/Valid.middleware');
const GameController = require('../controllers/Game.controller');

const router = express.Router();
//const auth = require('../middlewares/Auth.middleware');

const gameController = new GameController();

router.get('/get/:amount', gameController.fetch);
router.get('/info/:gameId', gameController.info);
router.get('/players/:gameId', gameController.players);
router.get('/leaderboard/:gameId', gameController.leaderboard);

module.exports = router;