const UserService = require('../services/user.services');

exports.verifyTokenForUser = async function (req, res, next) {
    try {
        if (!req.headers['authorization']) {
            res.sendStatus(401);
            return;
        }
        let [scheme, token] = req.headers['authorization'].toString().split(' ');
        if (!scheme || !token) {
            res.sendStatus(401);
            return;
        }
        if (scheme.toLowerCase() != 'bearer') {
            res.sendStatus(401);
            return;
        }
        let user = await UserService.verifyToken(token);
        if (!user) {
            res.status(401).send({
                success: false, message: 'Token invalid'
            });
            return;
        }
        req['user'] = user;
        next();
    } catch (error) {
        console.log('verifyTokenForUser', error);
        res.status(500).send({ success: false, message: error.message || error });
    }
}