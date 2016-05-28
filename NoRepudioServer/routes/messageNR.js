var bodyparser = require('body-parser');
var express = require('express');
var bigInt = require('../src/big-integer-scii.js');
var rsa = require('../src/rsa-big-integer.js');
keys = rsa.generateKeys(512);

module.exports = function(wagner) {
    var nrRoute = express.Router();
    nrRoute.use(bodyparser.json());

    //GET - Get a key with a identData
    nrRoute.get('/:identData', wagner.invoke(function(MessageNR){
        return function (req, res) {
            MessageNR.findOne({identData: req.params.identData}, function (err, message) {
                if (!message) {
                    res.status(404).send('Message not found in NR');
                } else {
                    var proofString = message.identData + "AAA" + message.key,
                        proofBigInt = bigInt(proofString.toString('hex'), 16),
                        proofKP = keys.privateKey.encrypt(proofBigInt);

                    var ttpRes = {
                        identData: message.identData,
                        key: message.key,
                        PKP: proofKP
                    };
                    res.status(200).send(ttpRes);
                }
            })
        }
    }));

    //POST - Insert a new Key in the DB
    nrRoute.post('/', wagner.invoke(function(MessageNR){
        return function(req, res) {
            var newMessageNR = new MessageNR({
                destiny: req.body.destiny,
                key: req.body.key,
                identData: req.body.identData
            });
            newMessageNR.save(function (err) {
                if (!err) {
                    res.status(200).send('OK');
                } else {
                    if (err.name == 'ValidationError') {
                        res.send(400, 'Validation error');
                    } else {
                        res.send(500, 'Server error');
                    }
                }
            });
        }
    }));

    return nrRoute;
};