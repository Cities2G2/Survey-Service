var passport = require('passport');
var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');
var rsa = require('../src/rsa-big-integer.js');
var bigInt = require('../src/big-integer-scii.js');
var CryptoJS = require("crypto-js");
keys = rsa.generateKeys(512);

module.exports = function (wagner) {
    var user = express.Router();
    user.use(bodyparser.json());
/*
    wagner.invoke(function(Subject, User){

        var newSubject1 = new Subject({
            name: "cities1",
            teacher: "Juan1",
            n: "7185517737010473602865464565547419617828016259875786641185652658435156844558994124715327171496251311259305965027161735168088932667872447807985771823639979",
            e: "65537",
            d: "3117192651188561804828845126616700293795387800548216885050418705951904180045652087527879073626244456705770340048171104048072877318542995851859221369959553"
        });

        Subject.findOne({name: newSubject1.name}, function(err, subject){
            if(!subject){
                newSubject1.save(function(err){
                    if(!err){
                        console.log("subject1 saved");
                    } else {
                        console.log("subject1 not saved")
                    }
                });
            }else{
                console.log(newSubject1.name + " ya existe")
            }
        });


        var newSubject2 = new Subject({
            name: "cities2",
            teacher: "Juan2",
            n: "8375342401439579632086863557783739338968426650421954920178690144060470728663781148050240789263334204213945904794410701330243172259393856470949228958990493",
            e: "65537",
            d: "2998468937622668979471963618357261945316633268212617731848461279126155068230677407589650475405033708930158599146339582948196914641759164061385936453532773"
        });

        Subject.findOne({name: newSubject2.name}, function(err, subject){
            if(!subject){
                newSubject2.save(function(err){
                    if(!err){
                        console.log("subject2 saved");
                    } else {
                        console.log("subject2 not saved")
                    }
                });
            }else{
                console.log(newSubject2.name + " ya existe")
            }
        });

        var newSubject3 = new Subject({
            name: "cities3",
            teacher: "Juan3",
            n: "10200691540084984263338507904131309299117530413696342011775815036052818833914878307703264390065901188778283469646518986434138747563454876052548322235787781",
            e: "65537",
            d: "4699163499804778367860184203329849688720224616932515398591995845911022070200314094403317952789136192840541830557305165167439388979384661199354514430265473"
        });

        Subject.findOne({name: newSubject3.name}, function(err, subject){
            if(!subject){
                newSubject3.save(function(err){
                    if(!err){
                        console.log("subject3 saved");
                    } else {
                        console.log("subject3 not saved")
                    }
                });
            }else{
                console.log(newSubject3.name + " ya existe")
            }
        });

        var newUser1 = new User({
            username: "alex",
            password: "alex"

        });
        User.findOne({username: newUser1.username},function(err,user){
            if(!user){
                User.register(new User({ username : newUser1.username }), newUser1.password, function(err, userr) {
                    if (err) {
                        console.log("no se pudo registrar alex");
                    }else{
                        console.log("alex registrado")
                        userr.subjects.push(newSubject1);
                        userr.subjects.push(newSubject2);
                        userr.save(function(err){
                            if(!err){
                                console.log('Subjects added to alex');
                            } else {
                                console.log('Subjects not added to alex');
                            }
                        });
                    }
                });
            }else{
                console.log("user alex ya existe");
            }
        });

        var newUser2 = new User({
            username: "dani",
            password: "dani"
        });

        User.findOne({username: newUser2.username},function(err,user){
            if(!user){
                User.register(new User({ username : newUser2.username }), newUser2.password, function(err, userr) {
                    if (err) {
                        console.log("no se pudo registrar alex");
                    }else{
                        console.log("dani registrado");
                        userr.subjects.push(newSubject1);
                        userr.subjects.push(newSubject3);
                        userr.save(function(err){
                            if(!err){
                                console.log('Subjects added to dani');
                            } else {
                                console.log('Subjects not added to dani');
                            }
                        });
                    }
                });
            }else{
                console.log("user dani ya existe");
            }
        });
    });
*/    
    user.get('/', wagner.invoke(function (User) {
        return function (req, res) {
            User.find(function (err, users) {
                if (err) res.status(500).send('Database error');
                else res.status(200).send(users);
            });
        }
    }));

    user.post('/subject', wagner.invoke(function(Subject){
        return function(req, res) {
            Subject.findOne({name: req.body.name}, function(err, subject){
                if(!subject){
                    var subjectKeys = rsa.generateKeys(512);
                    console.log(subjectKeys);
                    var newSubject = new Subject({
                        name: req.body.name,
                        teacher: req.body.teacher,
                        publicKey: subjectKeys.publicKey,
                        privateKey: subjectKeys.privateKey
                    });
                    console.log(newSubject);
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
                    res.status(404).send('Subject not found');
                } else {
                    var blindedPseudonym = bigInt(req.body.blindedPseudonym);
                    var blindedSignedPs = blindedPseudonym.modPow(keys.privateKey.d,keys.publicKey.n);
                    
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
                            console.log(err);
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
                    subjects: user.subjects
                };
                res.status(200).send(loginData);
            })
        });
    });

    user.get('/ping', wagner.invoke(function () {
        return function(req, res){
            res.status(200).send("pong!");
        }}));

    function createId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    return user;
};