var passport = require('passport');
var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');
var rsa = require('../src/rsa-big-integer.js');
var bigInt = require('../src/big-integer-scii.js');
var CryptoJS = require("crypto-js");
//keys = rsa.generateKeys(512);

module.exports = function (wagner) {
    var user = express.Router();
    user.use(bodyparser.json());
    
    user.get('/', wagner.invoke(function (User) {
        return function (req, res) {
            User.find(function (err, users) {
                if (err) res.status(500).send('Database error');
                else res.status(200).send(users);
            });
        }
    }));

    user.get('/getSubjects',wagner.invoke(function(Subject){
        return function (req,res) {
            Subject.find({}, {_id:1, name:1, n:1, e:1}, function (err, subjects) {
                if (err) res.status(400);
                else res.status(200).send(subjects);
            })
        }
    }));

    user.get('/getSubjects/:subjectId',wagner.invoke(function(Subject){
        return function (req,res) {
            Subject.findOne({_id: req.params.subjectId}, {_id:1, name:1, teacher:1, n:1, e:1}, function (err, subject) {
                if (err) res.status(400);
                else res.status(200).send(subject);
            })
        }
    }));

    user.post('/subject', wagner.invoke(function(Subject){
        return function(req, res) {
            Subject.findOne({name: req.body.name}, function(err, subject){
                if(!subject){
                    var subjectKeys = rsa.generateKeys(512);
                    var newSubject = new Subject({
                        name: req.body.name,
                        teacher: req.body.teacher,
                        n: subjectKeys.publicKey.n,
                        e: subjectKeys.publicKey.e,
                        d: subjectKeys.privateKey.d
                    });
                    newSubject.save(function(err){
                        if(!err){
                            res.status(200).send(newSubject);
                        } else {
                            if (err.name == 'ValidationError') {
                                res.status(400).send('Validation error');
                            } else {
                                res.status(500).send('Server error');
                            }
                        }
                    })
                } else {
                    res.status(400).send('There a Subject with this name');
                }
            })
        }
    }));

    user.post('/subject/:username', wagner.invoke(function(User, Subject){
        return function(req, res) {
            User.findOne({username: req.params.username}, function(err, user){
                if(!user){
                    res.status(404).send('User not found');
                } else {
                    Subject.findOne({name: req.body.name}, {_id:1, name:1}, function(err,subject){
                        if(!subject){
                            res.status(404).send('Subject not found');
                        } else {
                            var userSubjectExist = false;
                            _.each(user.subjects, function(sub){
                                if (subject._id.equals(sub._id)){
                                    userSubjectExist = true;
                                }
                            });
                            if (userSubjectExist){
                                res.status(400).send('This subjects si already in user');
                            } else {
                                user.subjects.push(subject);
                                user.save(function (err) {
                                    if (!err) {
                                        res.status(200).send('Subject added to User');
                                    } else {
                                        if (err.name == 'ValidationError') {
                                            res.status(400).send('Validation error');
                                        } else {
                                            res.status(500).send('Server error');
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
    }));

    user.post('/selectsubject', wagner.invoke(function (Subject, MessageNR) {
        return function(req, res) {
            Subject.findOne({_id: req.body.subject}, function(err, subject){
                if(!subject){
                    res.status(404).send('Subject not found selectsubject');
                } else {
                    var blindedPseudonym = bigInt(req.body.blindedPseudonym);
                    console.log("Blinded pseudonym",blindedPseudonym);
                    var blindedSignedPs = blindedPseudonym.modPow(subject.d,subject.n);
                    console.log("blinded signed ps", blindedSignedPs);
                    var hash = CryptoJS.SHA1(blindedSignedPs.toString(10)).toString(),
                        identData = createId(),
                        keyMsg = createId(),
                        proofString = "SERVER" + "AAA" + identData + "AAA" + hash,
                        proofBigInt = bigInt(proofString.toString('hex'), 16),
                        proofOrg = keys.privateKey.encrypt(proofBigInt),
                        msgEncrypt = CryptoJS.AES.encrypt(blindedSignedPs.toString(10), keyMsg).toString(),
                        message = {
                            "identData": identData,
                            "data": msgEncrypt,
                            "PO": proofOrg,
                            "publicKey": keys.publicKey
                        };

                    var newMessageNR = new MessageNR({
                        source: "TTPServer",
                        destiny: req.body.blindedPseudonym,
                        dataC: msgEncrypt,
                        key: keyMsg,
                        dataCK: blindedSignedPs.toString(10),
                        identData: identData
                    });
                    
                    newMessageNR.save(function (err) {
                        if (!err) {
                            res.status(200).send(message);
                        } else {
                            if (err.name == 'ValidationError') {
                                res.status(400).send('Validation error');
                            } else {
                                res.status(500).send('Server error');
                            }
                        }
                    });
                }
            });
        }
    }));

    user.post('/register', wagner.invoke(function (User) {
        return function(req, res) {
            User.register(new User({ username : req.body.username, type: req.body.type }), req.body.password, function(err, user) {
                if (err) {
                    return res.status(500).send(err);
                }
                passport.authenticate('local')(req, res, function () {
                    res.status(200).send(user.subjects);
                });
            });
    }}));

    user.post('/login',passport.authenticate('local'), function(req, res) {
        wagner.invoke(function(User){
            User.findOne({username: req.body.username}, function(err, user){
                var loginData = {
                    nTTP: keys.publicKey.n.toString(10),
                    eTTP: keys.publicKey.e.toString(10),
                    subjects: user.subjects,
                    type: user.type
                };
                res.status(200).send(loginData);
            })
        });
    });

    user.get('/ping', wagner.invoke(function () {
        return function(req, res){
            res.status(200).send("pong!");
        }
    }));

    function createId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    return user;
};