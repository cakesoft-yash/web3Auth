'use strict';
const express = require('express');
const router = express.Router({ caseSensitive: true });

const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/user.controller');

router.get('/detail', UserController.userDetail);
router.get('/getTokenId', UserController.getTokenId);
router.post('/list', AuthController.verifyTokenForAdmin, UserController.getUsers);
router.post('/getCredentials', AuthController.verifyTokenForUser, UserController.getCredentials);
router.post('/transactions', AuthController.verifyTokenForAdmin, UserController.getTransactions);
router.post('/transaction/create', AuthController.verifyTokenForAdmin, UserController.createTransactions);

module.exports = router;