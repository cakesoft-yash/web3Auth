const PhoneService = require('../services/phone.services');

exports.sendOTP = async function (req, res) {
    try {
        let result = await PhoneService.sendOTP(req.body, req.user);
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
        let result = await PhoneService.verifyOTP(req.body, req.user);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}