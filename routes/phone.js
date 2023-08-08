'use strict';
const express = require('express');
const router = express.Router({ caseSensitive: true });

const AuthController = require('../controllers/auth.controller');
const PhoneController = require('../controllers/phone.controller');

router.post('/sendOTP', AuthController.verifyTokenForUser, PhoneController.sendOTP);
router.post('/verifyOTP', AuthController.verifyTokenForUser, PhoneController.verifyOTP);

module.exports = router;