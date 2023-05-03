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
        console.log('Succesfully Connected to the Mongodb.');
    });
} catch (error) {
    console.log('marketplaceDbConnection', error);
}

// let chatDbConnection = mongoose.createConnection(config.mongodb.chatDbUrl, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// });

// chatDbConnection.on('connected', function () {
//     console.log('Succesfully Connected to the Chat Mongodb');
// });

module.exports = { marketplaceDbConnection };
