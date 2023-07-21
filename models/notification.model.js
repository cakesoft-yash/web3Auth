const mongoose = require('mongoose');
const chatDbConnection = require('../db_connect/database_connect').chatDbConnection;

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
    type: {
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
    logs: mongoose.Mixed,
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

const Notification = chatDbConnection.model('Notification', NotificationSchema);

module.exports = Notification;