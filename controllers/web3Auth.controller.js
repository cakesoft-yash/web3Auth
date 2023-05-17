const Web3AuthService = require('../services/web3Auth.services');

exports.getSignMessage = async function (req, res) {
    try {
        let result = await Web3AuthService.getSignMessage();
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.signup = async function (req, res) {
    try {
        let result = await Web3AuthService.signup(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.verifyData = async function (req, res) {
    try {
        let result = await Web3AuthService.verifyData(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.uploadData = async function (req, res) {
    try {
        let result = await Web3AuthService.uploadData(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.connectWallet = async function (req, res) {
    try {
        let result = await Web3AuthService.connectWallet(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.verifySignMessage = async function (req, res) {
    try {
        let result = await Web3AuthService.verifySignMessage(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}