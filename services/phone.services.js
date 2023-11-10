const config = require('config');
const { v4: uuidv4 } = require('uuid');
const Utils = require('../utils');
const Otp = require('../models/otp.model');

exports.sendOTP = async function (obj) {
  if (!obj.phone) throw Error('Phone is required');
  let otp = config.server.production ? await Utils.getUid(6, 'numeric') : 123456;
  let otpExpiryTime = new Date();
  otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 15);
  let oldOtp = await Otp.findOne(
    {
      phone: obj.phone
    }
  );
  if (oldOtp) {
    await Otp.findByIdAndUpdate(oldOtp._id,
      {
        $set: {
          otp,
          otpExpiryTime,
          numberOfUnsuccessfulAttempts: 0
        }
      }
    );
  } else {
    await Otp.create(
      {
        _id: uuidv4(),
        otp,
        otpExpiryTime,
        phone: obj.phone,
        numberOfUnsuccessfulAttempts: 0
      }
    );
  }
  await Utils.sendOtp(obj.phone, `${otp} is Your One-Time Password(OTP).`);
  return {
    success: true,
    message: 'OTP sent successfully'
  }
}

exports.verifyOTP = async function (obj) {
  if (!obj.phone) throw Error('Phone is required');
  if (!obj.otp) throw Error('Otp is required');
  let otpData = await Otp.findOne(
    {
      phone: obj.phone
    }
  );
  if (otpData.numberOfUnsuccessfulAttempts >= 3) {
    throw Error('Too many failed codes.Wait for some minutes before retrying');
  }
  if (new Date().getTime() >= new Date(otpData.otpExpiryTime).getTime()) throw Error('Otp expired');
  if (otpData.otp != obj.otp) {
    await Otp.findOneAndUpdate(
      {
        phone: obj.phone
      },
      {
        $inc: {
          numberOfUnsuccessfulAttempts: 1
        }
      }
    );
    throw Error('Invalid Otp');
  }
  await Otp.findOneAndUpdate(
    {
      phone: obj.phone
    },
    {
      $set: {
        otp: null,
        otpExpiryTime: null,
        numberOfUnsuccessfulAttempts: 0
      }
    }
  );
  return {
    success: true,
    message: 'Otp verified successfully'
  };
}