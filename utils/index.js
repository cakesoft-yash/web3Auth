'use strict';
const twilio = require('twilio');
const bcrypt = require('bcrypt');
const config = require('config');
const crypto = require('crypto');
const request = require('request');
const CryptoJS = require('crypto-js');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

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

exports.encrypt = function (string) {
  var base64 = CryptoJS.AES.encrypt(string, config.secretToDecrypt).toString();
  var parsedData = CryptoJS.enc.Base64.parse(base64);
  var hex = parsedData.toString(CryptoJS.enc.Hex);
  return hex;
}

exports.decrypt = function (cipherText) {
  var reb64 = CryptoJS.enc.Hex.parse(cipherText);
  var bytes = reb64.toString(CryptoJS.enc.Base64);
  var decrypt = CryptoJS.AES.decrypt(bytes, config.secretToDecrypt);
  var plain = decrypt.toString(CryptoJS.enc.Utf8);
  return plain;
}

exports.networks = config.networks;

exports.sendEmail = async function (to, from, subject, html, bcc = [], cc = []) {
  var transporter = nodemailer.createTransport(config.nodemailer);
  var mailOptions = {
    from,
    to,
    subject,
    html,
    bcc,
    cc
  };
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('sendEmail', error);
        reject(error);
      } else {
        console.log('Email sent: ' + info.response);
        resolve(info);
      }
    });
  });
  return true;
}

exports.hashPassword = async function (password) {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
}

exports.verifyPassword = async function (password, hash) {
  const verifyPassword = await bcrypt.compare(password, hash);
  return verifyPassword;
}

exports.sendOtp = async function (phone, message) {
  const startWithPlus = phone.startsWith('+');
  phone = startWithPlus ? phone : `+${phone}`;
  let twilioClient = new twilio(config.twilio.accountSid, config.twilio.authToken);
  return await new Promise((resolve, reject) => {
    twilioClient.messages.create({
      to: phone,
      from: config.twilio.phoneNumber,
      body: message
    }, function (error, message) {
      if (error != null && error) {
        console.log('Twilio Error', error);
        reject(error);
      } else {
        resolve(message);
      }
    })
  });
}
exports.sendOtpWithDoku = async function (phone, message) {
  try {
    const date = new Date().toISOString();
    const randomId = uuidv4();
    const body = { recipientNumber: phone, message };
    let digestmessage = JSON.stringify(body);
    let digbase = crypto.createHash('SHA256').update(digestmessage).digest('base64');
    let signmessage = `Client-Id:${config.dokuOtpSetting.clientId}\nRequest-Id:${randomId}\nRequest-Timestamp:${date}\nRequest-Target:/messageservice/sendsms\nDigest:${digbase}`
    let hash = crypto.createHmac('SHA256', config.dokuOtpSetting.secret).update(signmessage).digest('base64');
    let options = {
      method: 'POST',
      url: config.dokuOtpSetting.url,
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': config.dokuOtpSetting.clientId,
        'Request-Id': randomId,
        'Request-Timestamp': date,
        Signature: `HMACSHA256=${hash}`
      },
      body: JSON.stringify(body)
    };
    return await new Promise((resolve, reject) => {
      request(options, function (error, response) {
        if (error) {
          reject({ success: false, message: error })
          return true;
        };
        let serverError = response.body.includes('503 Service Unavailable');
        if (serverError) {
          reject({ success: false, message: '503 Service Unavailable for Doku Otp SMS API' });
          return true;
        }
        let result = JSON.parse(response.body);
        result.status == 'Success' ? resolve({ success: true, message: response.body }) : resolve({ success: false, message: response.body });
      });
    });
  } catch (error) {
    return { success: false, message: error.message };
  }
}