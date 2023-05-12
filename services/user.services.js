const Web3 = require('web3');
const config = require('config');
const chatUser = require('../models/chat.user.model');
const Utils = require('../utils');
const membershipABI = require('../contracts_abi/membership.json');

exports.verifyToken = async function (token) {
  let user = await chatUser.findOne({ accessToken: token });
  if (!user) throw Error('Unauthorized');
  return user;
}

exports.userDetail = async function (queryParams) {
  if (!queryParams.membershipId) throw Error('Membership Id is required');
  if (!queryParams.chainId) throw Error('Chain Id is required');
  if (!queryParams.walletAddress) throw Error('WalletAddress is required');
  let user = await chatUser.findOne(
    {
      walletAddress: queryParams.walletAddress
    }
  );
  if (!user) {
    return {
      success: true,
      userFound: false,
      user: {}
    }
  }
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
    userFound: true,
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

exports.getUsers = async function (obj, user) {
  if (!obj.membershipId) throw Error('Membership Id is required');
  if (!obj.chainId) throw Error('Chain Id is required');
  if (!obj.ztiAppName) throw Error('Community name is required');
  let page = parseInt(obj.page) || 0;
  let pageLimit = parseInt(obj.pageLimit) || 10;
  page = page > 1 ? page - 1 : 0;
  let query = {
    walletAddress: { $exists: true },
    loggedInApp: obj.ztiAppName
  };
  let users = await chatUser.aggregate([
    { $match: query },
    {
      $project: {
        emails: 1,
        firstName: 1,
        lastName: 1,
        phone: 1,
        userName: 1,
        displayUsername: 1,
        walletAddress: 1
      }
    },
    { $sort: { createdAt: -1 } },
    { $skip: page * pageLimit },
    { $limit: pageLimit }
  ]);
  const web3 = new Web3(Utils.networks[obj.chainId]);
  const myContract = await new web3.eth.Contract(membershipABI, config.contractAddress);
  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    const response = await myContract.methods
      .getUser(user.walletAddress)
      .call();
    let membership;
    if (response && response.membershipPurchased) {
      membership = response.membershipPurchased.find(mebership => mebership.membershipId === obj.membershipId);
      membership = membership ? membership : { status: 'pending' };
    }
    Object.assign(user, { membershipStatus: membership.status });
  }
  let totalUsers = await chatUser.countDocuments(query);
  return {
    success: true,
    totalUsers,
    pages: Math.ceil(totalUsers / pageLimit),
    users
  };
}

exports.getCredentials = async function (obj, user) {
  // const web3 = new Web3(Utils.networks[obj.chainId]);
  const web3 = new Web3(Utils.networks[80001]);
  const myContract = await new web3.eth.Contract(membershipABI, config.contractAddress);
  const response = await myContract.methods
    .getUser(user.walletAddress)
    .call();
  let result = [];
  for (let index = 0; index < response.membershipPurchased.length; index++) {
    const membershipPurchased = response.membershipPurchased[index];
    result.push(
      {
        membershipName: membershipPurchased.membership.membershipName,
        membershipDuration: membershipPurchased.membership.unlimitedDuration
          ? 'Forever'
          : membershipPurchased.membership.membershipDuration,
        membershipCount: membershipPurchased.membership.unlimitedCount
          ? 'Unlimited'
          : membershipPurchased.membership.membershipCount,
        contract: `https://mumbai.polygonscan.com/address/${config.contractAddress}`
      }
    );
  }
  return {
    success: true,
    result
  };
}
