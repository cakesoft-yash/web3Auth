const mongoose = require('mongoose');
const chatDbConnection = require('../db_connect/database_connect').chatDbConnection;

const Web3UserTransactionSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    walletAddress: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    event: {
        type: String,
        required: true
    },
    tokenId: {
        type: Number,
        required: true
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

const Web3UserTransaction = chatDbConnection.model('web3_user_transaction', Web3UserTransactionSchema);

module.exports = Web3UserTransaction;