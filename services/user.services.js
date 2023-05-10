const Web3 = require('web3');
const config = require('config');
const chatUser = require('../models/chat.user.model');
const Utils = require('../utils');
const membershipABI = require('../contracts_abi/membership.json');

exports.verifyToken = async function (token) {
  let user = await chatUser.findOne(
    {
      $or: [
        { accessToken: token },
        { walletAddress: token }
      ]
    }
  );
  if (!user) throw Error('Unauthorized');
  return user;
}

exports.userDetail = async function (queryParams, user) {
  if (!queryParams.membershipId) throw Error('Membership Id is required');
  if (!queryParams.chainId) throw Error('Chain Id is required');
  const web3 = new Web3(Utils.networks[queryParams.chainId]);
  const myContract = await new web3.eth.Contract(membershipABI, config.contractAddress);
  const response = await myContract.methods
    .getUser(user.walletAddress)
    .call();
  let membership;
  if (response && response.membershipPurchased) {
    membership = response.membershipPurchased.find(mebership => mebership.membershipId === queryParams.membershipId);
    membership = membership ? membership : {};
  }
  return {
    success: true,
    user: {
      membershipStatus: membership.status,
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