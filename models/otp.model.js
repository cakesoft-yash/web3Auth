const mongoose = require('mongoose');
const marketplaceDbConnection = require('../db_connect/database_connect').marketplaceDbConnection;

const OtpSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    otp: {
        type: Number
    },
    otpExpiryTime: {
        type: Date
    },
    email: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    numberOfUnsuccessfulAttempts: {
        type: Number,
        default: 0
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

const Otp = marketplaceDbConnection.model('otp', OtpSchema);

module.exports = Otp;