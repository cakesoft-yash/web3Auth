const fs = require('fs');
const Web3 = require('web3');
const config = require('config');
const request = require('request');
const { v4: uuidv4 } = require('uuid');
const convert = require('heic-convert');
const Shop = require('../models/shop.model');
const ChatUser = require('../models/chat.user.model');
const Web3UserTransaction = require('../models/web3UserTransaction.model');
const NotificationService = require('../services/notification.service');
const Utils = require('../utils');
// const membershipABI = require('../contracts_abi/membership.json');
// const membershipWithExpiryABI = require('../contracts_abi/membershipExpiry.json');

exports.getShopByToken = async function (token) {
  const shop = await Shop.findOne({ 'tokens.token': token });
  if (!shop) return false;
  let verifiedToken = shop.tokens.find(shopToken => shopToken.token == token);
  if (new Date().getTime() > new Date(verifiedToken.tokenExpiryTime).getTime()) {
    await Shop.findByIdAndUpdate(shop._id,
      {
        $pull: {
          tokens: { token }
        }
      },
      {
        new: true
      }
    );
    return false;
  }
  return shop;
}

exports.verifyToken = async function (token) {
  let user = await ChatUser.findOne({ accessToken: token });
  if (!user) throw Error('Unauthorized');
  return user;
}

exports.userDetail = async function (queryParams) {
  if (!queryParams.tokenId) throw Error('Token Id is required');
  // if (!queryParams.chainId) throw Error('Chain Id is required');
  if (!queryParams.walletAddress) throw Error('WalletAddress is required');
  let user = await ChatUser.findOne(
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
  // const web3 = new Web3(Utils.networks[queryParams.chainId]);
  // let contractAddress; let membershipABI_JSON;
  // if (queryParams.membershipWithExpiry === 'true') {
  //   contractAddress = config.contractAddressWithExpiry;
  //   membershipABI_JSON = membershipWithExpiryABI;
  // } else {
  //   contractAddress = config.contractAddress;
  //   membershipABI_JSON = membershipABI;
  // }
  // const myContract = await new web3.eth.Contract(membershipABI_JSON, contractAddress);
  // const response = await myContract.methods
  //   .getMembershipStatus(queryParams.tokenId)
  //   .call();
  // let membershipStatus; let expiryTime;
  // if (response._membershipStatus) {
  //   membershipStatus = response._membershipStatus;
  //   expiryTime = response._expiryTime;
  // } else {
  //   membershipStatus = response ? response : 'pending';
  // }
  return {
    success: true,
    userFound: true,
    user: {
      // expiryTime,
      membershipStatus: user.membershipStatus,
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

exports.getTokenId = async function (queryParams) {
  if (!queryParams.walletAddress) throw Error('WalletAddress is required');
  let user = await ChatUser.findOne(
    {
      walletAddress: queryParams.walletAddress
    }
  );
  return {
    success: true,
    tokenId: user && user.tokenId ? user.tokenId : null
  };
}

exports.getMembershipStatus = async function (chatUser) {
  let user = await ChatUser.findOne(
    {
      username: chatUser.username
    }
  );
  return {
    success: true,
    status: user && user.membershipStatus ? user.membershipStatus : 'pending'
  };
}

exports.getUsers = async function (obj, user) {
  if (!obj.chainId) throw Error('Chain Id is required');
  if (!obj.ztiAppName) throw Error('Community name is required');
  let page = parseInt(obj.page) || 0;
  let pageLimit = parseInt(obj.pageLimit) || 10;
  page = page > 1 ? page - 1 : 0;
  let query = {
    'registeredApps.appName': obj.ztiAppName
  };
  if (obj.membershipStatus) Object.assign(query,
    {
      walletAddress: { $exists: true },
      walletAddress: { $ne: null },
      membershipStatus: obj.membershipStatus
    }
  );
  if (obj.search) Object.assign(query,
    {
      $or: [
        { firstName: new RegExp(obj.search, 'i') },
        { lastName: new RegExp(obj.search, 'i') },
        { walletAddress: new RegExp(obj.search, 'i') },
        { phone: new RegExp(obj.search, 'i') },
        { username: new RegExp(obj.search, 'i') },
        { displayUsername: new RegExp(obj.search, 'i') },
        { 'emails.address': new RegExp(obj.search, 'i') },
      ]
    }
  );
  let users = await ChatUser.aggregate([
    { $match: query },
    {
      $project: {
        emails: 1,
        firstName: 1,
        lastName: 1,
        phone: 1,
        username: 1,
        displayUsername: 1,
        walletAddress: 1,
        tokenId: 1,
        membershipWithExpiry: 1,
        membershipStatus: 1,
        createdAt: 1,
        membershipAppeal: 1
      }
    },
    { $sort: { createdAt: -1 } },
    { $skip: page * pageLimit },
    { $limit: pageLimit }
  ]);
  const web3 = new Web3(Utils.networks[obj.chainId]);
  // for (let index = 0; index < users.length; index++) {
  //   const user = users[index];
  //   let contractAddress; let membershipABI_JSON;
  //   if (user.membershipWithExpiry) {
  //     contractAddress = config.contractAddressWithExpiry;
  //     membershipABI_JSON = membershipWithExpiryABI;
  //     const myContract = await new web3.eth.Contract(membershipABI_JSON, contractAddress);
  //     const response = await myContract.methods
  //       .getMembershipStatus(user.tokenId)
  //       .call();
  //     let membershipStatus; let expiryTime;
  //     if (response._membershipStatus) {
  //       membershipStatus = response._membershipStatus;
  //       expiryTime = response._expiryTime;
  //       Object.assign(user, { membershipStatus, expiryTime });
  //     }
  //   }
  // }
  let totalUsers = await ChatUser.countDocuments(query);
  return {
    success: true,
    totalUsers,
    pages: Math.ceil(totalUsers / pageLimit),
    users
  };
}

exports.sendMessage = async function (obj, user) {
  if (!obj.messageType) throw Error('Message type is required');
  if (!obj.message) throw Error('Message is required');
  if (!obj.toUsername) throw Error('To username is required');
  switch (obj.messageType) {
    case 'chat':
      let chatUserData = await ChatUser.findOne(
        {
          username: user.chatUsername
        }
      );
      await new Promise((resolve, reject) => {
        request.post({
          headers: {
            Authorization: `bearer ${chatUserData.accessToken}`
          },
          url: config.chatServer.sendMessage,
          body: {
            message: obj.message,
            toUsername: obj.toUsername
          },
          json: true
        }, function (err, httpResponse, response) {
          if (err) {
            reject(err);
            return;
          }
          if (!response.success) reject(response);
          resolve(response);
        });
      });
      return {
        success: true,
        message: 'Message send successfully'
      };
    case 'notification':
      await NotificationService.create(
        {
          _id: uuidv4(),
          username: obj.toUsername,
          type: 'message',
          title: 'Notification',
          message: obj.message,
        }
      );
      return {
        success: true,
        message: 'Notification send successfully'
      };
  }
}

exports.getCredentials = async function (obj, user) {
  let result = [];
  if (user.tokenId) {
    // // const web3 = new Web3(Utils.networks[obj.chainId]);
    // const web3 = new Web3(Utils.networks[80001]);
    // let contractAddress; let membershipABI_JSON;
    // if (user.membershipWithExpiry) {
    //   contractAddress = config.contractAddressWithExpiry;
    //   membershipABI_JSON = membershipWithExpiryABI;
    // } else {
    //   contractAddress = config.contractAddress;
    //   membershipABI_JSON = membershipABI;
    // }
    // const myContract = await new web3.eth.Contract(membershipABI_JSON, contractAddress);
    // const response = await myContract.methods
    //   .getMembershipStatus(user.tokenId)
    //   .call();
    // if (response) {
    //   let membershipStatus; let expiryTime;
    //   if (response._membershipStatus) {
    //     membershipStatus = response._membershipStatus;
    //     expiryTime = response._expiryTime;
    //   } else {
    //     membershipStatus = response;
    //   }
    //   result.push(
    //     {
    //       communityName: user.loggedInApp,
    //       membershipStatus,
    //       expiryTime,
    //       name: 'Membership Credential',
    //       membershipDuration: response === 'pending' ? 'pending' : 'Forever',
    //       membershipCount: response === 'pending' ? 'pending' : 'Unlimited',
    //     }
    //   );
    // }
    result.push(
      {
        communityName: user.loggedInApp,
        membershipStatus: user.membershipStatus,
        expiryTime: 0,
        name: 'Membership Credential',
        membershipDuration: user.membershipStatus === 'pending' ? 'pending' : 'Forever',
        membershipCount: user.membershipStatus === 'pending' ? 'pending' : 'Unlimited',
      }
    );
  }
  return {
    success: true,
    result
  };
}

exports.getTransactions = async function (obj, user) {
  if (!obj.walletAddress) throw Error('WalletAddress is required');
  if (!obj.tokenId) throw Error('Token Id is required');
  let transactions = await Web3UserTransaction.find(
    {
      tokenId: obj.tokenId,
      walletAddress: obj.walletAddress
    }
  );
  return {
    success: true,
    transactions
  };
}

exports.createTransaction = async function (obj, adminUser) {
  if (!obj.walletAddress) throw Error('WalletAddress is required');
  if (!obj.date) throw Error('Date is required');
  if (!obj.event) throw Error('Event is required');
  if (!obj.tokenId) throw Error('TokenId is required');
  if (obj.note) Object.assign(obj, { note: obj.note });
  Object.assign(obj,
    {
      _id: uuidv4(),
      transactionId: obj.transactionId
        ? obj.transactionId
        : null
    }
  );
  await Web3UserTransaction.create(obj);
  if (obj.updateMembershipStatus) {
    await ChatUser.findOneAndUpdate(
      {
        tokenId: obj.tokenId
      },
      {
        $set: {
          membershipStatus: obj.event
        }
      }
    );
    switch (obj.event) {
      case 'approved':
        await NotificationService.create(
          {
            _id: uuidv4(),
            username: obj.username,
            type: 'credentialPage',
            title: 'Membership Approved',
            message: 'Your membership has been approved',
          }
        );
        break;
      case 'rejected':
        await NotificationService.create(
          {
            _id: uuidv4(),
            username: obj.username,
            type: 'membershipAppeal',
            note: obj.note || null,
            title: 'Membership Rejected',
            message: obj.note || 'Your membership has been rejected',
          }
        );
        break;
      case 'suspended':
        await NotificationService.create(
          {
            _id: uuidv4(),
            username: obj.username,
            type: 'credentialPage',
            title: 'Membership Suspended',
            message: obj.note || 'Your membership has been suspended',
          }
        );
        break;
    }
  }
  return {
    success: true
  };
}

exports.createMembershipAppeal = async function (obj, file, user) {
  if (!file) throw Error('Select the file');
  if (file.mimetype === 'image/heic') {
    const inputBuffer = await fs.readFileSync(file.path);
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 1
    });
    let fileName = file.filename.split('.');
    Object.assign(file, { filename: `${fileName[0]}.jpg` });
    await fs.writeFileSync(`${file.destination}/${file.filename}`, outputBuffer);
    await fs.unlinkSync(file.path);
  }
  await ChatUser.findOneAndUpdate(
    {
      username: user.username
    },
    {
      $push: {
        membershipAppeal: {
          _id: uuidv4(),
          document: `${config.user.documentURL}/${file.filename}`,
          additional_information: obj.additional_information || null
        }
      }
    }
  );
  return {
    success: true,
    message: 'Membership appeal created successfully'
  };
}