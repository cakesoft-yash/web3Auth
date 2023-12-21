'use strict';
const express = require('express');
const router = express.Router({ caseSensitive: true });

const Web3AuthController = require('../controllers/web3Auth.controller');

router.get('/getSignMessage', Web3AuthController.getSignMessage);
router.post('/signup', Web3AuthController.signup);
router.post('/verifyData', Web3AuthController.verifyData);
router.post('/uploadData', Web3AuthController.uploadData);
router.post('/setPassword', Web3AuthController.setPassword);
router.post('/checkUsername', Web3AuthController.checkUsername);
router.post('/verifyPassword', Web3AuthController.verifyPassword);
router.post('/loginWithEmail', Web3AuthController.loginWithEmail);
router.post('/connectWallet', Web3AuthController.connectWallet);
router.post('/verifySignMessage', Web3AuthController.verifySignMessage);
router.post('/registerPrivateKey', Web3AuthController.registerPrivateKey);
router.post('/signup/existingUsers', Web3AuthController.signUpForExistingUsers);
router.post('/verifyPasswordAndLogin', Web3AuthController.verifyPasswordAndLogin);
router.post('/setPasswordAndRegisterKey', Web3AuthController.setPasswordAndRegisterKey);

module.exports = router;