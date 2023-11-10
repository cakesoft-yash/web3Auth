'use strict';
const express = require('express');
const router = express.Router({ caseSensitive: true });

const PhoneController = require('../controllers/phone.controller');

router.post('/sendOTP', PhoneController.sendOTP);
router.post('/verifyOTP', PhoneController.verifyOTP);

module.exports = router;