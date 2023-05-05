// const Web3 = require('web3');
const config = require('config');
const ethers = require('ethers');
const request = require('request');
// const Utils = require('../utils');
// const membershipABI = require('../contracts_abi/membership.json');

exports.getSignMessage = async function () {
  return {
    success: true,
    messageToSign: 'Sign Message'
  };
}

exports.signup = async function (obj) {
  if (!obj.firstName) throw Error('FirstName is required');
  if (!obj.lastName) throw Error('LastName is required');
  if (!obj.phone) throw Error('Phone is required');
  if (!obj.email) throw Error('Email is required');
  if (!obj.userName) throw Error('UserName is required');
  if (!obj.displayUsername) throw Error('DisplayUsername is required');
  if (!obj.walletAddress) throw Error('Wallet address is required');

  // if (!obj.chainId) throw Error('Chain Id is required');
  // if (!obj.walletAddress) throw Error('Wallet address is required');
  // const web3 = new Web3(Utils.networks[Number(obj.chainId)]);
  // const myContract = await new web3.eth.Contract(membershipABI, config.contractAddress);
  // const response = await myContract.methods
  //   .getUser(obj.walletAddress)
  //   .call();
  // let data = await Utils.decrypt(response);
  // if (data) data = JSON.parse(data);
  
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
        loggedInApp: 'zti',
        ztiAppName: obj.ztiAppName || 'zti',
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
  return result;
}

exports.connectWallet = async function (obj) {
  if (!obj.messageToSign) throw Error('Message is required');
  if (!obj.signature) throw Error('Signature is required');
  let userAddress = await ethers.utils.verifyMessage(obj.messageToSign, obj.signature);
  return {
    success: true,
    message: 'Wallet connected',
    walletAddress: userAddress
  };
}

exports.verifySignMessage = async function (obj) {
  if (!obj.messageToSign) throw Error('Message is required');
  if (!obj.signature) throw Error('Signature is required');
  let userAddress = await ethers.utils.verifyMessage(obj.messageToSign, obj.signature);
  let result = await new Promise((resolve, reject) => {
    request.post({
      url: config.chatServer.loginWithWallet,
      body: {
        walletAddress: userAddress,
        loggedInApp: 'zti'
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
  Object.assign(result, { walletAddress: userAddress });
  return result;
}