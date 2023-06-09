'use strict';
const express = require('express');
const router = express.Router({ caseSensitive: true });

const EmailController = require('../controllers/email.controller');

router.post('/sendOTP', EmailController.sendOTP);
router.post('/verifyOTP', EmailController.verifyOTP);

module.exports = router;