const express = require('express');
const auth = require('registry-auth-token');

const authController = require('../controllers/auth.controller');

const router = express.Router();

router.get('/signup', authController.getSignup)
router.get('/login', authController.getLogin)


module.exports = router;