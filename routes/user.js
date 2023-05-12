'use strict';
const express = require('express');
const router = express.Router({ caseSensitive: true });

const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/user.controller');

router.get('/detail', UserController.userDetail);
router.post('/list', AuthController.verifyTokenForAdmin, UserController.getUsers);
router.post('/getCredentials', AuthController.verifyTokenForUser, UserController.getCredentials);

module.exports = router;