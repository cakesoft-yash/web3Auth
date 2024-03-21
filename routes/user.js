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
let upload = multer(
    {
        storage: storage,
        limits: {
            fileSize: 1024 * 1024
        }
    }).single('document');

router.get('/detail', UserController.userDetail);
router.get('/getTokenId', UserController.getTokenId);
router.get('/membershipStatus', AuthController.verifyTokenForUser, UserController.getMembershipStatus);

router.post('/list', AuthController.verifyTokenForAdmin, UserController.getUsers);
router.post('/exportData', AuthController.verifyTokenForAdmin, UserController.exportData);
router.post('/sendMessage', AuthController.verifyTokenForAdmin, UserController.sendMessage);
router.post('/transactions', AuthController.verifyTokenForAdmin, UserController.getTransactions);
router.post('/transaction/create', AuthController.verifyTokenForAdmin, UserController.createTransaction);

router.post('/update', AuthController.verifyTokenForUser, UserController.updateUser);
router.post('/getCredentials', AuthController.verifyTokenForUser, UserController.getCredentials);
router.post('/create/membershipAppeal',
    [
        AuthController.verifyTokenForUser,
        (req, res, next) => {
            upload(req, res, error => {
                if (error) Object.assign(req, { multerError: error.message || error });
                next();
            });
        }
    ], UserController.createMembershipAppeal);

module.exports = router;