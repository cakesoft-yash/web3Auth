const DiscountNFTService = require('../services/discount-nft.services');

exports.list = async function (req, res) {
    try {
        let result = await DiscountNFTService.list(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.create = async function (req, res) {
    try {
        let result = await DiscountNFTService.create(req.body, req.file);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.buyNFT = async function (req, res) {
    try {
        let result = await DiscountNFTService.buyNFT(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.available = async function (req, res) {
    try {
        let result = await DiscountNFTService.available(req.body, req.user);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.purchased = async function (req, res) {
    try {
        let result = await DiscountNFTService.purchased(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}