const cors = require('cors');
const ethers = require('ethers');
const express = require('express');

const app = express();
const port = process.env.port || 3000;

app.use(cors());

app.get('/', (req, res) => res.send(new Date().toString()));

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

app.listen(port, () => {
    console.log(`Server running at ${port}`);
});