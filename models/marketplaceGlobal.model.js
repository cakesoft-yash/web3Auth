const mongoose = require('mongoose');
const marketplaceDbConnection = require('../db_connect/database_connect').marketplaceDbConnection;

const GlobalSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    type: {
        type: String
    },
    customFields: mongoose.Mixed
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

const MarketplaceGlobal = marketplaceDbConnection.model('global', GlobalSchema);

module.exports = MarketplaceGlobal;