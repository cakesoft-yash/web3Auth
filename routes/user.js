'use strict';
const config = require('config');
const multer = require('multer');
const express = require('express');
const router = express.Router({ caseSensitive: true });

const AuthController = require('../controllers/auth.controller');
const UserController = require('../controllers/user.controller');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        switch (file.fieldname) {
            case 'document':
                cb(null, config.user.documentPath);
                break;
        }
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + '_' + file.originalname);
    }
})
let upload = multer({ storage: storage });

router.get('/detail', UserController.userDetail);
router.get('/getTokenId', UserController.getTokenId);
router.post('/list', AuthController.verifyTokenForAdmin, UserController.getUsers);
router.post('/sendMessage', AuthController.verifyTokenForAdmin, UserController.sendMessage);
router.post('/getCredentials', AuthController.verifyTokenForUser, UserController.getCredentials);
router.post('/transactions', AuthController.verifyTokenForAdmin, UserController.getTransactions);
router.post('/transaction/create', AuthController.verifyTokenForAdmin, UserController.createTransaction);
router.post('/create/membershipAppeal', [AuthController.verifyTokenForUser, upload.single('document')], UserController.createMembershipAppeal);

module.exports = router;