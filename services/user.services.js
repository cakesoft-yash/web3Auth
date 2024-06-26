const fs = require('fs');
const Web3 = require('web3');
const config = require('config');
const request = require('request');
const { v4: uuidv4 } = require('uuid');
const convert = require('heic-convert');
const Shop = require('../models/shop.model');
const ChatUser = require('../models/chat.user.model');
const SocialUser = require('../models/socialUser.model');
const WalletUser = require('../models/wallet.user.model');
const MultipleUser = require('../models/multipleUser.model');
const MarketplaceUser = require('../models/marketplaceUser.model');
const Web3UserTransaction = require('../models/web3UserTransaction.model');
const NotificationService = require('../services/notification.service');
const Utils = require('../utils');
// const membershipABI = require('../contracts_abi/membership.json');

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
  // if (!queryParams.tokenId) throw Error('Token Id is required');
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
  // const myContract = await new web3.eth.Contract(membershipABI, config.contractAddress);
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
  let totalUsers = await ChatUser.countDocuments(query);
  return {
    success: true,
    totalUsers,
    pages: Math.ceil(totalUsers / pageLimit),
    users
  };
}

exports.exportData = async function (obj, user) {
  if (!obj.ztiAppName) throw Error('Community name is required');
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
    { $unwind: '$emails' },
    {
      $project: {
        email: '$emails.address',
        firstName: 1,
        lastName: 1,
        phone: 1,
        displayUsername: 1,
        walletAddress: 1,
        membershipStatus: 1,
        createdAt: 1,
      }
    },
    { $sort: { createdAt: -1 } },
  ]);
  let csvHeaders = [
    { label: 'Email', key: 'email' },
    { label: 'First Name', key: 'firstName' },
    { label: 'Last Name', key: 'lastName' },
    { label: 'Phone', key: 'phone' },
    { label: 'Username', key: 'displayUsername' },
    { label: 'Wallet Address', key: 'walletAddress' },
    { label: 'Status', key: 'membershipStatus' },
    { label: 'CreatedAt', key: 'createdAt' },
  ];
  return {
    success: true,
    csvData: users,
    csvHeaders
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
      if (!chatUserData) throw Error('Please configure phone number in database to send the chat message');
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
            reject(new Error(err));
            return;
          }
          if (response && typeof response === 'string' && response.includes('Application is not available')) {
            reject(new Error('Chat server not available. Please try after some time'));
            return;
          }
          if (!response.success) {
            reject(new Error(response.message || response.error || response));
            return;
          }
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
          membershipStatus: obj.event === 'restored' ? 'approved' : obj.event
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
      case 'restored':
        await NotificationService.create(
          {
            _id: uuidv4(),
            username: obj.username,
            type: 'credentialPage',
            title: 'Membership Restored',
            message: obj.note || 'Your membership has been restored',
          }
        );
        break;
    }
  }
  return {
    success: true
  };
}

exports.registerMultipleUsers = async function (obj, adminUser) {
  if (!obj.users || !obj.users.length) throw Error('Atleast one user is required');
  let dataForInsert = []; let dataForFindQuery = [];
  for (let index = 0; index < obj.users.length; index++) {
    const user = obj.users[index];
    if (!user.srNo) throw Error('Sr No is required');
    if (!user.firstName) throw Error(`FirstName is required for SR No : ${user.srNo}`);
    if (!user.lastName) throw Error(`LastName is required for SR No : ${user.srNo}`);
    if (!user.phone) throw Error(`Phone is required for SR No : ${user.srNo}`);
    if (!user.email) throw Error(`Email is required for SR No : ${user.srNo}`);
    if (!user.username) throw Error(`Username is required for SR No : ${user.srNo}`);
    if (!user.displayUsername) throw Error(`DisplayUsername is required for SR No : ${user.srNo}`);
    if (!user.loggedInApp) throw Error(`App name is required for SR No : ${user.srNo}`);
    dataForInsert.push(
      {
        srNo: user.srNo,
        _id: uuidv4(),
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        username: user.username,
        displayUsername: user.displayUsername,
        loggedInApp: user.loggedInApp,
        appNameForNotification: user.appNameForNotification,
      }
    );
    dataForFindQuery.push(
      {
        phone: user.phone,
        email: user.email,
        displayUsername: user.displayUsername,
      }
    );
  };
  let userExists = await MultipleUser.find(
    {
      $or: dataForFindQuery
    }
  );
  if (userExists.length) {
    let userSrNo = userExists.map(user => {
      let userFromData = dataForInsert.find(userData => userData.phone === user.phone && userData.email === user.email);
      return userFromData.srNo;
    }).join(',');
    throw Error(`User already register for SR NO : ${userSrNo}`);
  }
  await MultipleUser.insertMany(dataForInsert);
  return {
    success: true,
    message: 'User reqistered successfully'
  };
}

exports.updateUser = async function (obj, user) {
  if (Object.keys(obj).length === 0) throw Error('Atleast one field required to update the user');
  let query = {};
  if (obj.firstName && obj.lastName) Object.assign(query,
    {
      firstName: obj.firstName,
      lastName: obj.lastName,
      name: `${obj.firstName} ${obj.lastName}`,
      'data.name': `${obj.firstName} ${obj.lastName}`,
      membershipStatus: 'pending'
    }
  );
  if (obj.displayUsername) {
    const userExists = await SocialUser.findOne(
      {
        username: { $ne: user.username },
        zocial_username: obj.displayUsername
      }
    );
    if (userExists) throw Error('Username used already');
    Object.assign(query,
      {
        zocial_username: obj.displayUsername,
        displayUsername: obj.displayUsername
      }
    );
  }
  await ChatUser.findOneAndUpdate(
    {
      username: user.username
    },
    {
      $set: query
    }
  );
  await MarketplaceUser.findOneAndUpdate(
    {
      username: user.username
    },
    {
      $set: query
    }
  );
  await SocialUser.findOneAndUpdate(
    {
      username: user.username
    },
    {
      $set: query
    }
  );
  return {
    success: true,
    message: 'User updated successfully'
  };
}

exports.getCredentials = async function (obj, user) {
  let result = [];
  if (user.tokenId) {
    // // const web3 = new Web3(Utils.networks[obj.chainId]);
    // const web3 = new Web3(Utils.networks[80001]);
    // const myContract = await new web3.eth.Contract(membershipABI, config.contractAddress);
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
    // const walletUser = await WalletUser.findOne(
    //   {
    //     username: user.username,
    //     email: user.emails[0].address
    //   }
    // );
    // if (walletUser && walletUser.dokuId) {
    //   result.push(
    //     {
    //       communityName: user.loggedInApp,
    //       membershipStatus: 'pending',
    //       expiryTime: 0,
    //       name: 'Payment Gateway Credential',
    //       membershipDuration: 'Forever',
    //       membershipCount: 'Unlimited',
    //       logo: 'https://image.zocial.io/logo/doku.png'
    //     }
    //   );
    // };
    result.push(
      {
        communityName: user.loggedInApp,
        membershipStatus: user.membershipStatus,
        expiryTime: 0,
        name: 'Membership Credential',
        membershipDuration: user.membershipStatus === 'pending' ? 'Pending' : 'Forever',
        membershipCount: user.membershipStatus === 'pending' ? 'Pending' : 'Unlimited',
        logo: `https://image.zocial.io/logo/${user.loggedInApp}.png`
      }
    );
  }
  return {
    success: true,
    result
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
      $set: {
        membershipStatus: 'pending'
      },
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