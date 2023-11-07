const config = require('config');
const { v4: uuidv4 } = require('uuid');
const Utils = require('../utils');
const Otp = require('../models/otp.model');
const Shop = require('../models/shop.model');
const Admin = require('../models/admin.model');
const ChatUser = require('../models/chat.user.model');
const UserKeyShare = require('../models/userKeyShare.model');
const MarketplaceGlobal = require('../models/marketplaceGlobal.model');
const Web3AuthService = require('../services/web3Auth.services');

exports.sendOTP = async function (obj) {
  if (!obj.email) throw Error('Email is required');
  let globalData = await MarketplaceGlobal.findOne(
    {
      type: 'defaultEmailLogin'
    }
  );
  let email = await globalData.customFields.find(customField => customField.email === obj.email);
  let otp = email ? email.otp : await Utils.getUid(6, 'numeric');
  let otpExpiryTime = new Date();
  otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 15);
  let oldOtp = await Otp.findOne(
    {
      email: obj.email
    }
  );
  if (oldOtp) {
    await Otp.findByIdAndUpdate(oldOtp._id,
      {
        $set: {
          otp,
          otpExpiryTime
        }
      }
    );
  } else {
    await Otp.create(
      {
        _id: uuidv4(),
        otp,
        otpExpiryTime,
        email: obj.email
      }
    );
  }
  if (!email) {
    let body = `<!DOCTYPE html>
    <html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <style type="text/css">
            @media screen {
                @font-face {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 400;
                    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                }
    
                @font-face {
                    font-family: 'Lato';
                    font-style: normal;
                    font-weight: 700;
                    src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                }
    
                @font-face {
                    font-family: 'Lato';
                    font-style: italic;
                    font-weight: 400;
                    src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                }
    
                @font-face {
                    font-family: 'Lato';
                    font-style: italic;
                    font-weight: 700;
                    src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                }
            }
    
            /* CLIENT-SPECIFIC STYLES */
            body,
            table,
            td,
            a {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
    
            table,
            td {
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
    
            img {
                -ms-interpolation-mode: bicubic;
            }
    
            /* RESET STYLES */
            img {
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
            }
    
            table {
                border-collapse: collapse !important;
            }
    
            body {
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
            }
    
            /* iOS BLUE LINKS */
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }
    
            /* MOBILE STYLES */
            @media screen and (max-width:600px) {
                h1 {
                    font-size: 32px !important;
                    line-height: 32px !important;
                }
            }
    
            /* ANDROID CENTER FIX */
            div[style*="margin: 16px 0;"] {
                margin: 0 !important;
            }
        </style>
    </head>
    
    <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <!-- LOGO -->
            <tr>
                <td bgcolor="#2596be" align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td bgcolor="#2596be" align="center" style="padding: 0px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px;">
                                <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> 
                                <img src="https://image.zocial.io/marketplace/logos/zti_zti_new.png" width="125" height="120" style="display: block; border: 0px;" />
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#ffffff" align="left" style="text-align: center; color: gray; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 25px; font-weight: 600;">
                                <p style="margin: 0;">PT. Zocial Teknologi Indonesia</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td bgcolor="#ffffff" align="left" style="padding-top: 15px; text-align: center; color: gray; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 600;">
                                <p style="margin: 0;">Your verification code is</p>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#ffffff" align="left" style="padding-top: 5px; text-align: center; color: gray; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 30px; font-weight: 600;">
                                <p style="margin: 0;">${otp}</p>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#ffffff" align="left" style="padding: 5px 0px 20px 0px; text-align: center; color: gray; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 600;">
                                <p style="margin: 0;">Never share your code</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
`;
    await Utils.sendEmail(obj.email, config.nodemailer.from, 'Verification code for ZTi', body);
  }
  return {
    success: true,
    message: 'OTP sent successfully'
  }
}

exports.verifyOTP = async function (obj) {
  if (!obj.email) throw Error('Email is required');
  if (!obj.otp) throw Error('Otp is required');
  let otpData = await Otp.findOne(
    {
      email: obj.email
    }
  );
  if (new Date().getTime() >= new Date(otpData.otpExpiryTime).getTime()) throw Error('Otp expired');
  if (otpData.otp != obj.otp) throw Error('Invalid Otp');
  await Otp.findOneAndUpdate(
    {
      email: obj.email
    },
    {
      $set: {
        otp: null,
        otpExpiryTime: null
      }
    }
  );
  let privateKeyCreated = false; let walletAddress; let keyShare1; let keyShare2;
  let userKeyShare; let userRegistered = false; let userData;
  if (obj.walletAddressExistsOnPhone) {
    if (!obj.walletAddress) throw Error('Wallet address is required');
    let user = await ChatUser.findOne(
      {
        'emails.address': obj.email,
        walletAddress: obj.walletAddress
      }
    );
    if (user) {
      userRegistered = true;
      userData = await Web3AuthService.loginWithEmail({ walletAddress: obj.walletAddress });
    } else {
      throw Error('Wallet address and email mismatch');
    }
  } else {
    let user = await ChatUser.findOne(
      {
        'emails.address': obj.email,
        walletAddress: { $exists: true }
      }
    );
    if (user) userRegistered = true;
    userKeyShare = await UserKeyShare.findOne(
      {
        email: obj.email
      }
    );
    if (userKeyShare) {
      privateKeyCreated = true;
      walletAddress = userKeyShare.walletAddress;
      keyShare1 = userKeyShare.keyShare1;
      keyShare2 = userKeyShare.keyShare2;
    }
  }
  if (obj.publicAddress) {
    if (!obj.loginFor) throw Error('Login for is required');
    if (!obj.keyShare1) throw Error('KeyShare is required');
    if (!obj.keyShare2) throw Error('KeyShare is required');
    switch (obj.loginFor) {
      case "shop":
        if (!obj.shopId) throw Error('Shop Id is required');
        await Shop.findByIdAndUpdate(obj.shopId,
          {
            $set: {
              publicAddress: obj.publicAddress,
              keyShare1: obj.keyShare1,
              keyShare2: obj.keyShare2,
            }
          }
        );
        break;
      case "admin":
        if (!obj.adminId) throw Error('Admin Id is required');
        await Admin.findByIdAndUpdate(obj.adminId,
          {
            $set: {
              publicAddress: obj.publicAddress,
              keyShare1: obj.keyShare1,
              keyShare2: obj.keyShare2,
            }
          }
        );
        break;
    }
  }
  return {
    success: true,
    userData,
    userRegistered,
    privateKeyCreated,
    walletAddress,
    keyShare1,
    keyShare2,
    message: 'Otp verified successfully'
  };
}