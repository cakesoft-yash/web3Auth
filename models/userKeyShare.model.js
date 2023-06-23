const mongoose = require('mongoose');
const chatDbConnection = require('../db_connect/database_connect').chatDbConnection;

const UserKeyShareSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    walletAddress: {
        type: String,
        default: null
    },
    keyShare1: {
        type: String,
        default: null
    },
    keyShare2: {
        type: String,
        default: null
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
    }
});

const UserKeyShare = chatDbConnection.model('user_keyshare', UserKeyShareSchema);

module.exports = UserKeyShare;