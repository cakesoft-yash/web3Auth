const mongoose = require('mongoose');
const marketplaceDbConnection = require('../db_connect/database_connect').marketplaceDbConnection;

const UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    name: {
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
    }
}
);

const User = marketplaceDbConnection.model('User', UserSchema);

module.exports = User;