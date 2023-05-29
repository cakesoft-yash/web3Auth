const cors = require('cors');
const http = require('http');
const ethers = require('ethers');
const config = require('config');
const routes = require('./routes');
const cluster = require('cluster');
const express = require('express');
const bodyParser = require('body-parser');
require('./db_connect/database_connect');
const NotificationService = require('./services/notification.service');

const app = express();

if (cluster.isMaster) {
    _master();
} else {
    _worker();
}


async function _master() {
    console.log('Master is running (' + process.pid + ')');
    let cores = config.server.numCores;
    for (let i = 0; i < cores; i++) {
        cluster.setupMaster({
            args: [(i + 1).toString()]
        })
        cluster.fork();
        switch (i) {
            case 1:
                NotificationService.send();
                break;
        }
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log('Worker died (' + worker.process.pid + ')');
    });
}

async function _worker() {
    var workerNum = parseInt(process.argv[2]);
    console.log('Worker number ' + workerNum + ' started (' + process.pid + ')');
    app.use(cors());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json({
        limit: '50mb'
    }));

    app.get('/getSignMessage', async (req, res) => res.json(
        {
            success: true,
            messageToSign: 'Sign Message'
        }
    ));
    app.get('/verifySignMessage', async (req, res) => {
        try {
            if (!req.query.messageToSign) throw Error('Message is required');
            if (!req.query.signature) throw Error('Signature is required');
            let userAddress = await ethers.utils.verifyMessage(req.query.messageToSign, req.query.signature);
            if (userAddress) {
                res.json(
                    {
                        success: true,
                        address: userAddress,
                        signature: req.query.signature,
                        signedMessage: req.query.messageToSign
                    }
                );
            }
        } catch (error) {
            res.json(
                {
                    success: false,
                    error: error.message
                }
            );
        }
    });
    app.use('/', routes);
    try {
        let port = config.server.port + workerNum - 1;
        let server = await http.createServer(app).listen(port, config.server.host);
        console.log('Express server listening on port ' + port);
    } catch (e) {
        console.log(e);
    }
}