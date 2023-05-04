'use strict';
const express = require('express');
const router = express.Router({ caseSensitive: true });

const Web2AuthController = require('../controllers/web2Auth.controller');

router.post('/login', Web2AuthController.login);
router.post('/signup', Web2AuthController.signup);

module.exports = router;