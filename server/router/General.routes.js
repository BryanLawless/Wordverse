const express = require('express');
const GeneralController = require('../controllers/General.controller');

const router = express.Router();

const generalController = new GeneralController();

router.get('/health', generalController.health);

module.exports = router;