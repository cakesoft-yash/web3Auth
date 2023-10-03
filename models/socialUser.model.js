const mongoose = require('mongoose');
const splendSocialDbConnection = require('../db_connect/database_connect').splendSocialDbConnection;

const UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    data: {
        name: {
            type: String
        }
    },
    zocial_username: {
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

const User = splendSocialDbConnection.model('User', UserSchema);

module.exports = User;