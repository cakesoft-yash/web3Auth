'use strict';
const express = require('express');
const router = express.Router({ caseSensitive: true });

const Web3AuthController = require('../controllers/web3Auth.controller');

router.get('/getSignMessage', Web3AuthController.getSignMessage);
router.post('/verifySignMessage', Web3AuthController.verifySignMessage);

module.exports = router;