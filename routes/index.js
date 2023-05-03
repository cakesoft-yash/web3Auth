'use strict';
const express = require('express');
const router = express.Router({ caseSensitive: true });

const web2Auth = require('./web2Auth');
const web3Auth = require('./web3Auth');

router.use('/time', (req, res) => res.send(new Date().toString()));
router.use('/reactNativeMessage', (req, res) => {
    res.set({ 'Content-Type': 'text/html' });
    let message = req.query.message
        ? req.query.message
        : 'Message is required';
    return res.status(500).end(`<html>
        <body onload="func1()">
        </body>
        <script>
            function func1() {
                setTimeout(() => {
                    window.ReactNativeWebView.postMessage(${message});
                }, 1000);
            }
        </script>
    </html>`);
});
router.use('/web2Auth', web2Auth);
router.use('/web3Auth', web3Auth);

module.exports = router;