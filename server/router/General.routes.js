const express = require('express');
const ValidatorSchema = require('../schemas/Validation.schema');
const Validate = require('../middlewares/Valid.middleware');
const GeneralController = require('../controllers/General.controller');

const router = express.Router();
const auth = require('../middlewares/Auth.middleware');

const generalController = new GeneralController();

router.get('/health', generalController.health);

module.exports = router;