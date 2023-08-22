const mongoose = require('mongoose');
const walletDbConnection = require('../db_connect/database_connect').walletDbConnection;

const NotificationSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    message: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'error', 'failed', 'processing', 'cancelled'],
        default: 'pending'
    },
    sentAt: {
        type: Date
    },
    isCleared: {
        type: Boolean,
        default: false
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
    },
}
);

const Notification = walletDbConnection.model('Notification', NotificationSchema);

module.exports = Notification;