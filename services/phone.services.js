const { v4: uuidv4 } = require('uuid');
const Utils = require('../utils');
const Otp = require('../models/otp.model');

exports.sendOTP = async function (obj, user) {
  let otp = await Utils.getUid(6, 'numeric');
  let otpExpiryTime = new Date();
  otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 15);
  let oldOtp = await Otp.findOne(
    {
      phone: user.phone
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
        phone: user.phone
      }
    );
  }
  await Utils.sendOtp(user.phone, `${otp} is Your One-Time Password(OTP).`);
  return {
    success: true,
    message: 'OTP sent successfully'
  }
}

exports.verifyOTP = async function (obj, user) {
  if (!obj.otp) throw Error('Otp is required');
  let otpData = await Otp.findOne(
    {
      phone: user.phone
    }
  );
  if (new Date().getTime() >= new Date(otpData.otpExpiryTime).getTime()) throw Error('Otp expired');
  if (otpData.otp != obj.otp) throw Error('Invalid Otp');
  await Otp.findOneAndUpdate(
    {
      phone: user.phone
    },
    {
      $set: {
        otp: null,
        otpExpiryTime: null
      }
    }
  );
  return {
    success: true,
    message: 'Otp verified successfully'
  };
}