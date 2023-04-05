const express = require("express");
const GeneralController = require("../controllers/general.controller");

/* Access router instance */
const router = express.Router();

/* Create a new general controller */
const generalController = new GeneralController();

/* Assign methods to routes */
router.get("/health", generalController.health);

module.exports = router;
