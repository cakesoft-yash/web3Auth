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

exports.setPassword = async function (req, res) {
    try {
        let result = await Web3AuthService.setPassword(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.checkUsername = async function (req, res) {
    try {
        let result = await Web3AuthService.checkUsername(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.verifyPassword = async function (req, res) {
    try {
        let result = await Web3AuthService.verifyPassword(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.loginWithEmail = async function (req, res) {
    try {
        let result = await Web3AuthService.loginWithEmail(req.body);
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

exports.registerPrivateKey = async function (req, res) {
    try {
        let result = await Web3AuthService.registerPrivateKey(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.signUpForExistingUsers = async function (req, res) {
    try {
        let result = await Web3AuthService.signUpForExistingUsers(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.verifyPasswordAndLogin = async function (req, res) {
    try {
        let result = await Web3AuthService.verifyPasswordAndLogin(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.setPasswordAndRegisterKey = async function (req, res) {
    try {
        let result = await Web3AuthService.setPasswordAndRegisterKey(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}