const mongoose = require('mongoose');
const walletDbConnection = require('../db_connect/database_connect').walletDbConnection;

const WalletUserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    dokuId: {
        type: String
    },
    email: {
        type: String
    },
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
}
);

const WalletUser = walletDbConnection.model('User', WalletUserSchema);

module.exports = WalletUser;