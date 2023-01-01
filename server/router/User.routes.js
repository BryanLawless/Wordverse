const express = require('express');
const ValidatorSchema = require('../schemas/Validation.schema');
const Validate = require('../middlewares/Valid.middleware');
const UserController = require('../controllers/User.controller');

const router = express.Router();
const auth = require('../middlewares/Auth.middleware');

const userController = new UserController();

router.get('/@me', auth(), userController.me);

module.exports = router;