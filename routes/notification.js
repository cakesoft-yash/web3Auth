'use strict';
const express = require('express');
const router = express.Router({ caseSensitive: true });

const AuthController = require('../controllers/auth.controller');
const NotificationController = require('../controllers/notification.controller');

router.get('/list', AuthController.verifyTokenForUser, NotificationController.list);
router.post('/clearAll', AuthController.verifyTokenForUser, NotificationController.clearAll);

module.exports = router;