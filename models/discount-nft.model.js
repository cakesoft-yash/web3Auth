const mongoose = require('mongoose');
const marketplaceDbConnection = require('../db_connect/database_connect').marketplaceDbConnection;

const DiscountNFTSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    isRemoved: {
        type: Boolean,
        default: false
    },
    isSoldOut: {
        type: Boolean,
        default: false
    },
    name: {
        type: String
    },
    code: {
        type: String
    },
    expiry: {
        type: Date
    },
    image: {
        type: String
    },
    discount_amount: {
        type: Number
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    numberOfRedemptions: {
        type: Number
    },
    tokenId: {
        type: Number
    },
    purchasedBy: [
        {
            _id: {
                type: String
            },
            walletAddress: {
                type: String
            },
            isUsed: {
                type: Boolean,
                default: false
            }
        }
    ],
    unlimitedCount: {
        type: Boolean,
        default: false
    },
    transactionId: {
        type: String
    },
    timezoneOffset: {
        type: Number
    },
    appName: {
        type: String
    }
}, {
    timestamps: true,
    toObject: {
        transform: function (doc, ret) {
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.__v;
        }
    },
    toJSON: {
        transform: function (doc, ret) {
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.__v;
        }
    },
}
);

const DiscountNFT = marketplaceDbConnection.model('discount-nft', DiscountNFTSchema);

module.exports = DiscountNFT;