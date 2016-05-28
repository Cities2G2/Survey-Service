var passport = require('passport');
var bodyparser = require('body-parser');
var express = require('express');
var bigInt = require('../src/big-integer-scii.js');
var status = require('http-status');
var _ = require('underscore');
var http = require('http');
var CryptoJS = require("crypto-js");
var rsa = require('../src/rsa-big-integer.js');
keys = rsa.generateKeys(512);

module.exports = function (wagner) {
    var nrTTPRoute = express.Router();
    nrTTPRoute.use(bodyparser.json());

    nrTTPRoute.post('/:identData', wagner.invoke(function(MessageNR){
        return function (req, res) {
            MessageNR.findOne({identData: req.params.identData}, function (err, message) {
                if (!message) {
                    res.status(404).send('Message not found');
                } else {
                    var proofString = message.identData + "AAA" + message.key,
                        proofBigInt = bigInt(proofString.toString('hex'), 16),
                        proofKP = keys.privateKey.encrypt(proofBigInt);

                    var ttpRes = {
                        identData: message.identData,
                        key: message.key,
                        PKP: proofKP
                    };
                    
                    var ttpToServer = JSON.stringify(ttpRes);
                    var options = {
                        host: "localhost",
                        port: 3004,
                        path: '/NR',
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                            "Content-Length": Buffer.byteLength(ttpToServer)
                        }
                    };

                    var reqPost = http.request(options);
                    reqPost.end(ttpToServer);
                    res.status(200).send('Ident available: ' + message.identData);
                }
            })
        }
    }));
    //POST - Insert a new Message in the DB
    nrTTPRoute.post('/datanr', wagner.invoke(function (MessageNR) {
        return function (req, res) {
            //var publicKeyOrg = rsa.publicKeyP(req.body.publicKey.n, req.body.publicKey.e);
            //var proofOrg = publicKeyOrg.decrypt(req.body.PO);
            var hash = CryptoJS.SHA1(req.body.data).toString(),
                proofString = "CLIENT" + "AAA" + req.body.identMsg + "AAA" + hash,
                proofBigInt = bigInt(proofString.toString('hex'), 16),
                proofRec = keys.privateKey.encrypt(proofBigInt);

            var newMessageNR = new MessageNR({
                destiny: req.body.destiny,
                dataC: req.body.data,
                identData: req.body.identMsg
            });

            var serverRes = {
                identMsg: req.body.identMsg,
                PR: proofRec,
                publicKey: keys.publicKey
            };

            newMessageNR.save(function (err) {
                if (!err) {
                    res.status(200).send(serverRes);
                } else {
                    if (err.name == 'ValidationError') {
                        res.status(400).send('Validation error');
                    } else {
                        res.status(500).send('Server error');
                    }
                }
            });
        }
    }));
    
    return nrTTPRoute;
};