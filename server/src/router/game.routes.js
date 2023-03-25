const express = require("express");
const GameController = require("../controllers/Game.controller");

/* Access router instance */
const router = express.Router();

/* Create a new game controller */
const gameController = new GameController();

/* Assign methods to routes */
router.get("/get/:amount", gameController.fetch);
router.get("/info/:gameId", gameController.info);
router.get("/players/:gameId", gameController.players);
router.get("/leaderboard/:gameId", gameController.leaderboard);

module.exports = router;
