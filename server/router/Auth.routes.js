const express = require('express');
const ValidatorSchema = require('../schemas/Validation.schema');
const Validate = require('../middlewares/Valid.middleware');
const AuthController = require('../controllers/Auth.controller');

const router = express.Router();

const authController = new AuthController();

router.post('/login', Validate(ValidatorSchema.user.login, 'body'), authController.login);
router.post('/register', Validate(ValidatorSchema.user.register, 'body'), authController.register);
router.post('/logout', authController.logout);

module.exports = router;