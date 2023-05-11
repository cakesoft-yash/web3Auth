const mongoose = require('mongoose');
const marketplaceDbConnection = require('../db_connect/database_connect').marketplaceDbConnection;

const AdminSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    phone: {
        type: String
    },
    aggregator: {
        type: String
    },
    roleId: {
        type: String
    },
    isRemoved: {
        type: Boolean,
        default: false
    },
    tokens: [
        {
            _id: {
                type: String
            },
            token: {
                type: String
            },
            tokenExpiryTime: {
                type: Date
            }
        }
    ],
    role: {
        type: String
    },
    forApp: {
        type: String
    },
    jokulId: {
        type: String

    },
    connectUserId: {
        type: String
    },
    walletAddress: [
        {
            type: String
        }
    ]
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

const Admin = marketplaceDbConnection.model('Admin', AdminSchema);

module.exports = Admin;