const NotificationService = require('../services/notification.service');

exports.list = async function (req, res) {
    try {
        let result = await NotificationService.list(req.user);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}