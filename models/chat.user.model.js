const mongoose = require('mongoose');
const chatDbConnection = require('../db_connect/database_connect').chatDbConnection;

const UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    name: {
        type: String
    },
    walletAddress: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    accessToken: {
        type: String
    },
    phone: {
        type: String
    },
    displayUsername: {
        type: String
    },
    emails: [
        {
            address: {
                type: String
            }
        }
    ],
    loggedInApp: {
        type: String
    },
    tokenId: {
        type: Number
    },
    membershipWithExpiry: {
        type: Boolean
    },
    membershipStatus: {
        type: String
    },
    createdAt: {
        type: Date
    },
    membershipAppeal: [
        {
            _id: {
                type: String
            },
            document: {
                type: String
            },
            additional_information: {
                type: String
            }
        }
    ]
});

const User = chatDbConnection.model('User', UserSchema);

module.exports = User;