const config = require('config');
const { v4: uuidv4 } = require('uuid');
const DiscountNFT = require('../models/discount-nft.model');

exports.list = async function (obj) {
  let page = parseInt(obj.page) || 0;
  let pageLimit = parseInt(obj.pageLimit) || 10;
  page = page > 1 ? page - 1 : 0;
  let discountNFTs = await DiscountNFT
    .find(
      { isRemoved: false },
      {
        name: 1,
        code: 1,
        expiry: 1,
        image: 1,
        amount: 1,
        description: 1,
        numberOfRedemptions: 1,
        unlimitedCount: 1
      }
    )
    .sort({ createdAt: -1 })
    .skip(page * pageLimit)
    .limit(pageLimit);
  let totalDiscountNFTs = await DiscountNFT.countDocuments({ isRemoved: false });
  return {
    success: true,
    totalDiscountNFTs,
    pages: Math.ceil(totalDiscountNFTs / pageLimit),
    discountNFTs
  };
}

exports.create = async function (obj, file) {
  if (!file) throw Error('Select the file');
  if (!obj.name) throw Error('Name is required');
  if (!obj.code) throw Error('Code is required');
  if (!obj.expiry) throw Error('Expiry is required');
  if (!obj.amount) throw Error('Amount is required');
  if (!obj.description) throw Error('Description is required');
  if (!obj.transactionId) throw Error('Transaction id is required');
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
  if (discountNFT.purchasedBy.find(address => address === obj.walletAddress)) throw Error('NFT purchased already');
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
      $addToSet: {
        purchasedBy: obj.walletAddress
      }
    }
  );
  return {
    success: true,
    message: 'NFT purchased successfully'
  };
}

exports.listForApp = async function (obj) {
  if (!obj.walletAddress) throw Error('Wallet address is required');
  let discountNFTs = await DiscountNFT
    .find(
      { isRemoved: false },
      {
        name: 1,
        expiry: 1,
        image: 1,
        amount: 1,
        description: 1,
        numberOfRedemptions: 1,
        unlimitedCount: 1
      }
    ).sort({ createdAt: -1 });
  let purchasedNFTs = await DiscountNFT
    .find(
      {
        isRemoved: false,
        purchasedBy: obj.walletAddress
      },
      {
        code: 1,
        name: 1,
        expiry: 1,
        image: 1,
        amount: 1,
        description: 1,
        numberOfRedemptions: 1,
        unlimitedCount: 1
      }
    ).sort({ createdAt: -1 });
  return {
    success: true,
    coupon: [
      {
        title: 'Available Coupon',
        data: discountNFTs,
      },
      {
        title: 'Purchased Coupon',
        data: purchasedNFTs,
      },
    ]
  };
}