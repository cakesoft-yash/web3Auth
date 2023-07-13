'use strict';
const config = require('config');
const multer = require('multer');
const express = require('express');
const router = express.Router({ caseSensitive: true });

const AuthController = require('../controllers/auth.controller');
const DiscountNFTController = require('../controllers/discount-nft.controller');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        switch (file.fieldname) {
            case 'dicountNFTImage':
                cb(null, config.dicountNFTImage.path);
                break;
        }
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + '_' + file.originalname);
    }
})
let upload = multer({ storage: storage });


router.post('/list', AuthController.verifyTokenForAdmin, DiscountNFTController.list);
router.post('/create', [AuthController.verifyTokenForAdmin, upload.single('dicountNFTImage')], DiscountNFTController.create);

router.post('/buy', AuthController.verifyTokenForUser, DiscountNFTController.buyNFT);
router.post('/available', AuthController.verifyTokenForUser, DiscountNFTController.available);
router.post('/purchased', AuthController.verifyTokenForUser, DiscountNFTController.purchased);

module.exports = router;