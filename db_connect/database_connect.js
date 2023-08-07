const config = require('config');
const mongoose = require('mongoose');

let marketplaceDbConnection;
try {
    marketplaceDbConnection = mongoose.createConnection(config.mongodb.url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        poolSize: 100
    });
    marketplaceDbConnection.on('connected', function () {
        console.log('Succesfully Connected to the Marketplace Mongodb.');
    });
} catch (error) {
    console.log('marketplaceDbConnection', error);
}

let chatDbConnection = mongoose.createConnection(config.mongodb.chatDbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

chatDbConnection.on('connected', function () {
    console.log('Succesfully Connected to the Chat Mongodb');
});

let splendSocialDbConnection = mongoose.createConnection(config.mongodb.splendSocialDbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

splendSocialDbConnection.on('connected', function () {
    console.log('Succesfully Connected to the Social Mongodb');
});

let walletDbConnection = mongoose.createConnection(config.mongodb.walletDbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

walletDbConnection.on('connected', function () {
    console.log('Succesfully Connected to the Wallet Mongodb');
});
module.exports = { marketplaceDbConnection, chatDbConnection, splendSocialDbConnection, walletDbConnection };
