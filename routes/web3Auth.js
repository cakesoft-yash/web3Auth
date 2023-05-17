'use strict';
const express = require('express');
const router = express.Router({ caseSensitive: true });

const Web3AuthController = require('../controllers/web3Auth.controller');

router.get('/getSignMessage', Web3AuthController.getSignMessage);
router.post('/signup', Web3AuthController.signup);
router.post('/verifyData', Web3AuthController.verifyData);
router.post('/uploadData', Web3AuthController.uploadData);
router.post('/connectWallet', Web3AuthController.connectWallet);
router.post('/verifySignMessage', Web3AuthController.verifySignMessage);

module.exports = router;