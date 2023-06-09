const EmailService = require('../services/email.services');

exports.sendOTP = async function (req, res) {
    try {
        let result = await EmailService.sendOTP(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

exports.verifyOTP = async function (req, res) {
    try {
        let result = await EmailService.verifyOTP(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}