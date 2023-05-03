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