const mongoose = require('mongoose');
const splendSocialDbConnection = require('../db_connect/database_connect').splendSocialDbConnection;

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

const Notification = splendSocialDbConnection.model('Notification', NotificationSchema);

module.exports = Notification;