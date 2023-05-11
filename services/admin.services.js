const Admin = require('../models/admin.model');

exports.getUserByToken = async function (token) {
    const user = await Admin.findOne({ 'tokens.token': token });
    if (!user) return false;
    let verifiedToken = user.tokens.find(userToken => userToken.token == token);
    if (new Date().getTime() > new Date(verifiedToken.tokenExpiryTime).getTime()) return false;
    return user;
}