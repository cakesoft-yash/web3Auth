const config = require('config');
const ethers = require('ethers');
const request = require('request');
const CryptoJS = require('crypto-js');
const { v4: uuidv4 } = require('uuid');
const IPFS = import('ipfs-http-client');
const Utils = require('../utils');
const ChatUser = require('../models/chat.user.model');
const SocialUser = require('../models/socialUser.model');
const UserKeyShare = require('../models/userKeyShare.model');
const MarketplaceUser = require('../models/marketplaceUser.model');
const UserService = require('../services/user.services');

exports.getSignMessage = async function () {
  return {
    success: true,
    messageToSign: 'Sign Message'
  };
}

exports.signup = async function (obj) {
  if (!obj.tokenId) throw Error('Token Id is required');
  if (!obj.firstName) throw Error('FirstName is required');
  if (!obj.lastName) throw Error('LastName is required');
  if (!obj.phone) throw Error('Phone is required');
  if (!obj.email) throw Error('Email is required');
  if (!obj.userName) throw Error('UserName is required');
  if (!obj.displayUsername) throw Error('DisplayUsername is required');
  if (!obj.walletAddress) throw Error('Wallet address is required');
  if (!obj.ztiAppName) throw Error('Zti AppName is required');
  if (!obj.transactionId) throw Error('TransactionId is required');
  if (!obj.date) throw Error('Date is required');
  let result = await new Promise((resolve, reject) => {
    request.post({
      url: config.chatServer.signup,
      body: {
        signInMethod: 'web3',
        walletAddress: obj.walletAddress,
        firstName: obj.firstName,
        lastName: obj.lastName,
        phone: obj.phone,
        email: obj.email,
        userName: obj.userName,
        displayUsername: obj.displayUsername,
        loggedInApp: obj.ztiAppName,
        appNameForNotification: 'zti',
        // ztiAppName: obj.ztiAppName,
        tokenId: obj.tokenId,
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
        reject(new Error(response));
        return;
      }
      resolve(response);
    });
  });
  await UserService.createTransaction(
    {
      transactionId: obj.transactionId,
      walletAddress: obj.walletAddress,
      date: obj.date,
      event: 'mint',
      tokenId: obj.tokenId,
    }
  );
  if (obj.paymentTransactionId) {
    await UserService.createTransaction(
      {
        transactionId: obj.paymentTransactionId,
        walletAddress: obj.walletAddress,
        date: obj.paymentTransactionDate,
        event: 'payment',
        tokenId: obj.tokenId,
      }
    );
  }
  return result;
}

exports.verifyData = async function (obj) {
  if (!obj.phone) throw Error('Phone is required');
  if (!obj.email) throw Error('Email is required');
  if (!obj.userName) throw Error('UserName is required');
  if (!obj.displayUsername) throw Error('DisplayUsername is required');
  if (!obj.walletAddress) throw Error('Wallet address is required');
  let result = await new Promise((resolve, reject) => {
    request.post({
      url: config.chatServer.verifyData,
      body: {
        signInMethod: 'web3',
        walletAddress: obj.walletAddress,
        phone: obj.phone,
        email: obj.email,
        userName: obj.userName,
        displayUsername: obj.displayUsername,
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
        reject(new Error(response));
        return;
      }
      resolve(response);
    });
  });
  return result;
}

exports.uploadData = async function (obj) {
  if (!obj.tokenId) throw Error('Token Id is required');
  if (!obj.firstName) throw Error('FirstName is required');
  if (!obj.lastName) throw Error('LastName is required');
  if (!obj.phone) throw Error('Phone is required');
  if (!obj.email) throw Error('Email is required');
  if (!obj.userName) throw Error('UserName is required');
  if (!obj.displayUsername) throw Error('DisplayUsername is required');
  if (!obj.walletAddress) throw Error('Wallet address is required');
  if (!obj.ztiAppName) throw Error('Zti AppName is required');
  const ipfs = (await IPFS).create(
    {
      host: config.ipfs.host,
      port: config.ipfs.port,
      protocol: config.ipfs.protocol
    }
  );
  const result = await ipfs.add(JSON.stringify(obj));
  return {
    success: true,
    tokenUri: `${config.ipfs.gateway}/ipfs/${result.path}`
  };
}

exports.setPassword = async function (obj) {
  if (!obj.email) throw Error('Email is required');
  if (!obj.password) throw Error('Password is required');
  if (!obj.confirmPassword) throw Error('Confirm password is required');
  if (obj.password !== obj.confirmPassword) throw Error('Password mismatch');
  const hashPassword = await Utils.hashPassword(obj.password);
  let userKeyShare = await UserKeyShare.findOne(
    {
      email: obj.email
    }
  );
  if (userKeyShare) {
    await UserKeyShare.findOneAndUpdate(
      {
        email: obj.email
      },
      {
        $set: {
          email: obj.email,
          password: hashPassword,
        }
      }
    );
  } else {
    await UserKeyShare.create(
      {
        _id: uuidv4(),
        email: obj.email,
        password: hashPassword,
      }
    );
  }
  return {
    success: true,
    message: 'Password set successfully'
  };
}

exports.checkUsername = async function (obj) {
  if (!obj.email) throw Error('Email is required');
  if (!obj.username) throw Error('Username is required');
  if (!obj.displayUsername) throw Error('Display username is required');
  let userNameData = await ChatUser.findOne(
    {
      'emails.address': { $ne: obj.email },
      displayUsername: obj.displayUsername
    }
  );
  let userExists = await SocialUser.findOne(
    {
      username: { $ne: obj.username },
      zocial_username: obj.displayUsername
    }
  );
  if (userNameData || userExists) throw Error('This username is in use with another member');
  return {
    success: true
  };
}

exports.verifyPassword = async function (obj) {
  if (!obj.email) throw Error('Email is required');
  if (!obj.password) throw Error('Password is required');
  let userKeyShare = await UserKeyShare.findOne(
    {
      email: obj.email
    }
  );
  let verifyPassword = await Utils.verifyPassword(obj.password, userKeyShare.password);
  if (!verifyPassword) throw Error('Invalid password');
  return {
    success: true,
    message: 'Password verified successfully',
    keyShare2: userKeyShare.keyShare2,
    walletAddress: userKeyShare.walletAddress
  };
}

exports.loginWithEmail = async function (obj) {
  if (!obj.walletAddress) throw Error('Wallet address is required');
  if (!obj.appName) throw Error('App name is required');
  let result = await new Promise((resolve, reject) => {
    request.post({
      url: config.chatServer.loginWithWallet,
      body: {
        walletAddress: obj.walletAddress,
        loggedInApp: obj.appName,
        appNameForNotification: 'zti'
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
        reject(new Error(response));
        return;
      }
      resolve(response);
    });
  });
  Object.assign(result, { walletAddress: obj.walletAddress });
  return result;
}

exports.connectWallet = async function (obj) {
  if (!obj.messageToSign) throw Error('Message is required');
  if (!obj.signature) throw Error('Signature is required');
  if (!obj.walletAddress) throw Error('Wallet address is required');
  let userAddress = await ethers.utils.verifyMessage(obj.messageToSign, obj.signature);
  if (userAddress !== obj.walletAddress) throw Error('Address mismatch');
  return {
    success: true,
    message: 'Wallet connected',
    walletAddress: userAddress
  };
}

exports.verifySignMessage = async function (obj) {
  if (!obj.messageToSign) throw Error('Message is required');
  if (!obj.signature) throw Error('Signature is required');
  if (!obj.walletAddress) throw Error('Wallet address is required');
  let userAddress = await ethers.utils.verifyMessage(obj.messageToSign, obj.signature);
  if (userAddress !== obj.walletAddress) throw Error('Address mismatch');
  let result = await new Promise((resolve, reject) => {
    request.post({
      url: config.chatServer.loginWithWallet,
      body: {
        walletAddress: userAddress,
        loggedInApp: obj.appName || 'zti',
        appNameForNotification: 'zti'
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
        reject(new Error(response));
        return;
      }
      resolve(response);
    });
  });
  Object.assign(result, { walletAddress: userAddress });
  return result;
}


exports.registerPrivateKey = async function (obj) {
  if (!obj.email) throw Error('Email is required');
  if (!obj.walletAddress) throw Error('WalletAddress is required');
  if (!obj.keyShare1) throw Error('KeyShare is required');
  if (!obj.keyShare2) throw Error('keyShare is required');
  await UserKeyShare.findOneAndUpdate(
    {
      email: obj.email
    },
    {
      $set: {
        walletAddress: obj.walletAddress,
        keyShare1: obj.keyShare1,
        keyShare2: obj.keyShare2
      }
    }
  );
  return {
    success: true,
    message: 'Key registered successfully'
  };
}

exports.signUpForExistingUsers = async function (obj) {
  if (!obj.email) throw Error('Email is required');
  if (!obj.tokenId) throw Error('Token Id is required');
  if (!obj.appName) throw Error('App name is required');
  if (!obj.username) throw Error('Username is required');
  if (!obj.firstName) throw Error('Firstname is required');
  if (!obj.lastName) throw Error('Lastname is required');
  if (!obj.transactionId) throw Error('TransactionId is required');
  if (!obj.date) throw Error('Date is required');
  if (!obj.displayUsername) throw Error('Display username is required');
  await module.exports.setPassword(obj);
  await module.exports.registerPrivateKey(obj);
  await ChatUser.findOneAndUpdate(
    {
      'emails.address': obj.email
    },
    {
      $set: {
        ztiRegistered: true,
        name: `${obj.firstName} ${obj.lastName}`,
        firstName: obj.firstName,
        lastName: obj.lastName,
        membershipStatus: 'pending',
        tokenId: obj.tokenId,
        walletAddress: obj.walletAddress,
        displayUsername: obj.displayUsername
      }
    }
  );
  await SocialUser.findOneAndUpdate(
    {
      username: obj.username
    },
    {
      $set: {
        zocial_username: obj.displayUsername,
        'data.name': `${obj.firstName} ${obj.lastName}`
      }
    }
  );
  await MarketplaceUser.findOneAndUpdate(
    {
      username: obj.username
    },
    {
      $set: {
        name: `${obj.firstName} ${obj.lastName}`
      }
    }
  );
  await UserService.createTransaction(
    {
      transactionId: obj.transactionId,
      walletAddress: obj.walletAddress,
      date: obj.date,
      event: 'mint',
      tokenId: obj.tokenId,
    }
  );
  return await module.exports.loginWithEmail({ walletAddress: obj.walletAddress, appName: obj.appName });
}

exports.verifyPasswordAndLogin = async function (obj) {
  let verifyPassword = await module.exports.verifyPassword(obj);
  return await module.exports.loginWithEmail({ walletAddress: verifyPassword.walletAddress, appName: obj.appName });
}

exports.setPasswordAndRegisterKey = async function (obj) {
  await module.exports.setPassword(obj);
  return await module.exports.registerPrivateKey(obj);
}