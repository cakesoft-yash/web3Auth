'use strict';
const config = require('config');
const CryptoJS = require('crypto-js');

function _getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.capitalizeFirstLetter = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

exports.getUid = async function (length, type) {
  let uid = '';
  let chars = '';
  if (type == 'numeric') {
    chars = '123456789';
  } else if (type == 'alphaNumeric') {
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
  } else if (type == 'alphaNumericWithSmallLetter') {
    chars = 'abcdefghijklmnopqrstuvwxyz123456789';
  }
  const charsLength = chars.length;
  for (let i = 0; i < length; ++i) {
    uid += chars[_getRandomInt(0, charsLength - 1)];
  }
  return uid;
}

exports.trimTextOfObject = function (obj) {
  let keys = Object.keys(obj);
  for (let index = 0; index < keys.length; index++) {
    if (typeof obj[keys[index]] === 'string') {
      obj[keys[index]] = obj[keys[index]].trim();
    } else {
      obj[keys[index]] = obj[keys[index]];
    }
  }
  return obj;
}

exports.decrypt = function (cipherText) {
  var reb64 = CryptoJS.enc.Hex.parse(cipherText);
  var bytes = reb64.toString(CryptoJS.enc.Base64);
  var decrypt = CryptoJS.AES.decrypt(bytes, config.secretToDecrypt);
  var plain = decrypt.toString(CryptoJS.enc.Utf8);
  return plain;
}

exports.networks = {
  // chainId : RPC URL
  80001: 'https://matic-mumbai.chainstacklabs.com' //for polygon testnet
}