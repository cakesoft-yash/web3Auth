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