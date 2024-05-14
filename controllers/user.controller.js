const UserService = require('../services/user.services');

exports.userDetail = async function (req, res) {
    try {
        let result = await UserService.userDetail(req.query, req.user);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.getTokenId = async function (req, res) {
    try {
        let result = await UserService.getTokenId(req.query, req.user);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.getMembershipStatus = async function (req, res) {
    try {
        let result = await UserService.getMembershipStatus(req.user);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.getUsers = async function (req, res) {
    try {
        let result = await UserService.getUsers(req.body, req.user);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.exportData = async function (req, res) {
    try {
        let result = await UserService.exportData(req.body, req.user);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.sendMessage = async function (req, res) {
    try {
        let result = await UserService.sendMessage(req.body, req.user);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.getTransactions = async function (req, res) {
    try {
        let result = await UserService.getTransactions(req.body, req.user);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.createTransaction = async function (req, res) {
    try {
        let result = await UserService.createTransaction(req.body, req.user);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.registerMultipleUsers = async function (req, res) {
    try {
        let result = await UserService.registerMultipleUsers(req.body, req.user);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.updateUser = async function (req, res) {
    try {
        let result = await UserService.updateUser(req.body, req.user);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.getCredentials = async function (req, res) {
    try {
        let result = await UserService.getCredentials(req.body, req.user);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.createMembershipAppeal = async function (req, res) {
    try {
        if (req.multerError) throw Error(req.multerError);
        let result = await UserService.createMembershipAppeal(req.body, req.file, req.user);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}