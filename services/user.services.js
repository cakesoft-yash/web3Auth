const config = require('config');
const request = require('request');
const chatUser = require('../models/chat.user.model');

exports.verifyToken = async function (token) {
  let user = await chatUser.findOne({ accessToken: token });
  if (!user) throw Error('Unauthorized');
  return user;
}

exports.userDetail = async function (user) {
  return {
    success: true,
    user: {
      email: user.emails[0].address,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      userName: user.username,
      displayUsername: user.displayUsername,
      walletAddress: user.walletAddress
    }
  };
}