const config = require('config');
const { v4: uuidv4 } = require('uuid');
const ChatUser = require('../models/chat.user.model');
const DiscountNFT = require('../models/discount-nft.model');
const NotificationService = require('../services/notification.service');

exports.list = async function (obj) {
  if (!obj.userId) throw Error('User Id is required');
  let page = parseInt(obj.page) || 0;
  let pageLimit = parseInt(obj.pageLimit) || 10;
  page = page > 1 ? page - 1 : 0;
  let discountNFTs = await DiscountNFT
    .find(
      {
        isRemoved: false,
        userId: obj.userId
      },
      {
        name: 1,
        price: 1,
        code: 1,
        expiry: 1,
        image: 1,
        description: 1,
        discount_amount: 1,
        numberOfRedemptions: 1,
        unlimitedCount: 1
      }
    )
    .sort({ createdAt: -1 })
    .skip(page * pageLimit)
    .limit(pageLimit);
  let totalDiscountNFTs = await DiscountNFT.countDocuments({ isRemoved: false, userId: obj.userId });
  return {
    success: true,
    totalDiscountNFTs,
    pages: Math.ceil(totalDiscountNFTs / pageLimit),
    discountNFTs
  };
}

exports.create = async function (obj, file) {
  if (!file) throw Error('Select the file');
  if (!obj.userId) throw Error('User Id is required');
  if (!obj.appName) throw Error('App Name is required');
  if (!obj.name) throw Error('Name is required');
  if (!obj.code) throw Error('Code is required');
  if (!obj.price) throw Error('Price is required');
  if (!obj.expiry) throw Error('Expiry is required');
  if (!obj.description) throw Error('Description is required');
  if (!obj.transactionId) throw Error('Transaction id is required');
  if (!obj.discount_amount) throw Error('Discount amount is required');
  if (!obj.numberOfRedemptions) throw Error('Number of redemptions is required');
  if (!obj.tokenId) throw Error('tokenId is required');
  if (!obj.unlimitedCount) throw Error('UnlimitedCount is required');
  if (!obj.timezoneOffset) throw Error('TimezoneOffset is required');
  Object.assign(obj,
    {
      _id: uuidv4(),
      unlimitedCount: obj.unlimitedCount === 'true' ? true : false,
      image: `${config.dicountNFTImage.url}/${file.filename}`
    }
  );
  await DiscountNFT.create(obj);
  module.exports.notifyUser();
  return {
    success: true,
    message: 'Otp verified successfully'
  };
}

exports.buyNFT = async function (obj) {
  if (!obj.walletAddress) throw Error('Wallet address is required');
  if (!obj.discountNFTId) throw Error('DiscountNFT Id is required');
  let discountNFT = await DiscountNFT.findById(obj.discountNFTId);
  if (!discountNFT) throw Error('NFT not found');
  if (discountNFT.purchasedBy.find(address => address.walletAddress === obj.walletAddress)) throw Error('NFT purchased already');
  let expDate = new Date(discountNFT.expiry);
  let expiry = new Date(expDate.setMinutes(expDate.getMinutes() - discountNFT.timezoneOffset));
  let date = new Date();
  let currentDate = new Date(date.setMinutes(date.getMinutes() - discountNFT.timezoneOffset));
  if (currentDate > expiry) throw Error('NFT is expired');
  if (!discountNFT.unlimitedCount) {
    let nftPurchased = discountNFT.purchasedBy.length;
    if (nftPurchased === discountNFT.numberOfRedemptions) throw Error('NFT is sold out');
  }
  await DiscountNFT.findByIdAndUpdate(obj.discountNFTId,
    {
      $push: {
        purchasedBy: {
          _id: uuidv4(),
          walletAddress: obj.walletAddress
        }
      }
    }
  );
  return {
    success: true,
    message: 'NFT purchased successfully'
  };
}

exports.available = async function (obj) {
  let discountNFTs = await DiscountNFT
    .find(
      { isRemoved: false },
      {
        name: 1,
        price: 1,
        expiry: 1,
        image: 1,
        description: 1,
        discount_amount: 1,
        numberOfRedemptions: 1,
        unlimitedCount: 1
      }
    ).sort({ createdAt: -1 });
  return {
    success: true,
    availableCoupons: discountNFTs
  };
}

exports.purchased = async function (obj) {
  if (!obj.walletAddress) throw Error('Wallet address is required');
  let purchasedNFTs = await DiscountNFT.aggregate([
    {
      $match: {
        isRemoved: false,
        'purchasedBy.walletAddress': obj.walletAddress
      }
    },
    { $unwind: '$purchasedBy' },
    {
      $match: {
        'purchasedBy.isUsed': false,
        'purchasedBy.walletAddress': obj.walletAddress
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $project: {
        code: 1,
        name: 1,
        price: 1,
        expiry: 1,
        image: 1,
        purchasedBy: 1,
        description: 1,
        discount_amount: 1,
        numberOfRedemptions: 1,
        unlimitedCount: 1
      }
    }
  ]);
  return {
    success: true,
    purchasedCoupons: purchasedNFTs
  };
}

exports.notifyUser = async function () {
  let users = await ChatUser.find(
    {
      walletAddress: { $exists: true }
    }
  );
  users.forEach(async user => {
    await NotificationService.create(
      {
        _id: uuidv4(),
        username: user.username,
        type: 'discount-nft',
        title: 'Reward',
        message: 'New reward NFT has been created',
      }
    );
  });
}