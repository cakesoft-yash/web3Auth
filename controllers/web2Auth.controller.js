const Web2AuthService = require('../services/web2Auth.services');

exports.login = async function (req, res) {
    try {
        let result = await Web2AuthService.login(req.body);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}