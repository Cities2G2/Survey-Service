var bodyparser = require('body-parser');
var express = require('express');
var http = require('http');
var status = require('http-status');
var _ = require('underscore');
var rsa = require('../src/rsa-big-integer.js');
var bigInt = require('../src/big-integer-scii.js');
var CryptoJS = require("crypto-js");
keys = rsa.generateKeys(512);

module.exports = function (wagner) {
    var resolvedSurvey = express.Router();
    resolvedSurvey.use(bodyparser.json());

    resolvedSurvey.get('/', wagner.invoke(function (ResolvedSurvey) {
        return function (req, res) {
            ResolvedSurvey.find(function (err, resolvedSurveys) {
                if (err) res.status(500).send('Database error');
                else res.status(200).send(resolvedSurveys);
            });
        }
    }));

    resolvedSurvey.get('/resolvedByTeacher/:teacher', wagner.invoke(function (ResolvedSurvey) {
        return function (req, res) {
            console.log("Me pide los resultados de la encuesta con el teacher: " + req.params.teacher);
            ResolvedSurvey.find({teacher: req.params.teacher}, function (err, resolvedSurveys) {
                console.log("Yo le envio estos resultados: " + resolvedSurveys);
                if (err) res.status(500).send('Database error');
                else res.status(200).send(resolvedSurveys);
            });
        }
    }));

    resolvedSurvey.post('/resolvedByTeacher/', wagner.invoke(function (ResolvedSurvey) {
        return function (req, res) {
            console.log("Me pide los resultados de la encuesta con el teacher: " + req.body.teacher);
            ResolvedSurvey.find({teacher: req.body.teacher}, function (err, resolvedSurveys) {
                console.log("Yo le envio estos resultados: " + resolvedSurveys);
                if (err) res.status(500).send('Database error');
                else res.status(200).send(resolvedSurveys);
            });
        }
    }));

    resolvedSurvey.get('/resolvedById/:resolvedSurveyID', wagner.invoke(function (ResolvedSurvey) {
        return function (req, res) {
            console.log("Me pide los resultados de la encuesta con el id: " + req.params.resolvedSurveyID);
            ResolvedSurvey.findOne({_id: req.params.resolvedSurveyID}, function (err, resolvedSurvey) {
                console.log("Yo le envio estos resultados: " + resolvedSurvey);
                if (err) res.status(500).send('Database error');
                if (resolvedSurvey){
                    res.status(200).send(resolvedSurvey);
                } else {
                    res.status(404).send('Survey not found');
                }
            });
        }
    }));
    
    resolvedSurvey.post('/', wagner.invoke(function(ResolvedSurvey){
        return function(req, res) {
            var newResolvedSurvey = ResolvedSurvey({
                subject: req.body.subject,
                teacher: req.body.teacher,
                period: req.body.period,
                questions: req.body.questions
            });

            newResolvedSurvey.save(function (err) {
                if (!err) {
                    res.status(200).send('OK');
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

    resolvedSurvey.post('/NR', wagner.invoke(function(ResolvedSurvey, MessageNR){
        return function(req, res) {
            var hash = CryptoJS.SHA1(req.body.data).toString(),
                proofString = req.body.identData + "AAA" + hash,
                proofBigInt = bigInt(proofString.toString('hex'), 16),
                proofRec = keys.privateKey.encrypt(proofBigInt),
                getKeyMsg = {
                    PR: proofRec
                };
            var newMessageNR = MessageNR({
                source: req.body.publicKey,
                destiny: "SurveyServer",
                dataC: req.body.data,
                identData: req.body.identData
            });

            newMessageNR.save(function (err) {
                if (!err) {
                    res.status(200).send(getKeyMsg);
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

    resolvedSurvey.get('/NR/:identData', wagner.invoke(function(ResolvedSurvey, MessageNR){
        return function(req, res) {
            MessageNR.findOne({identData: req.params.identData}, function(err, messageNR){
                if (!err) {
                    var options = {
                            host: "localhost",
                            port: 3004,
                            path: '/NR/' + req.params.identData,
                            agent: false
                        },
                        result = '';

                    http.get(options, function(response){
                        response.on('data', function (chunk) {
                            result += chunk;
                        });
                        response.on('end', function() {
                            // Data reception is done, do whatever with it!
                            var parsed = JSON.parse(result);
                            //Desencriptar el mensaje
                            var bytes  = CryptoJS.AES.decrypt(messageNR.dataC, parsed.key);
                            var plaintext = bytes.toString(CryptoJS.enc.Utf8);
                            console.log(JSON.parse(plaintext));
                            MessageNR.update({identData: messageNR.identData}, {
                                key: parsed.key,
                                dataCK: plaintext
                            }, function (err) {
                                if (!err) {
                                    var newResolvedSurvey = ResolvedSurvey(JSON.parse(plaintext));
                                    newResolvedSurvey.save(function (err) {
                                        if (!err) {
                                            res.status(200).send('OK');
                                        } else {
                                            if (err.name == 'ValidationError') {
                                                res.status(400).send('Validation error');
                                            } else {
                                                res.status(500).send('Server error');
                                            }
                                        }
                                    });
                                } else {
                                    if (err.name == 'ValidationError') {
                                        res.status(400).send('Validation error');
                                    } else {
                                        res.status(500).send('Server error');
                                    }
                                }
                            });
                        });
                    })
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

    return resolvedSurvey;
};



