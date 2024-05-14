const mongoose = require('mongoose');
const chatDbConnection = require('../db_connect/database_connect').chatDbConnection;

const MultipleUserSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    username: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    phone: {
        type: String
    },
    displayUsername: {
        type: String
    },
    email: {
        type: String
    },
    loggedInApp: {
        type: String
    },
    appNameForNotification: {
        type: String
    }
}, {
    timestamps: true,
    toObject: {
        transform: function (doc, ret) {
            delete ret.updatedAt;
            delete ret.__v;
        }
    },
    toJSON: {
        transform: function (doc, ret) {
            delete ret.updatedAt;
            delete ret.__v;
        }
    }
}
);

const MultipleUser = chatDbConnection.model('userdata', MultipleUserSchema);

module.exports = MultipleUser;