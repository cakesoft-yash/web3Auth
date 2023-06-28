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

exports.listForApp = async function (req, res) {
    try {
        let result = await DiscountNFTService.listForApp(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}