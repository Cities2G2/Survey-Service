var bodyparser = require('body-parser');
var express = require('express');
var http = require('http');
var status = require('http-status');
var _ = require('underscore');
var rsa = require('../src/rsa-big-integer.js');
var bigInt = require('../src/big-integer-scii.js');

module.exports = function (wagner) {
    var survey = express.Router();
    survey.use(bodyparser.json());
    
    survey.get('/', wagner.invoke(function (Subject) {
        return function (req, res) {
            Subject.find(function (err, subjects) {
                if (err) res.status(500).send('Database error');
                else res.status(200).send(subjects);
            });
        }
    }));

    survey.get('/:subject', wagner.invoke(function(Survey){
        return function (req,res){
            Survey.findOne({subject: req.params.subject}, function (err, survey){
                if(err) res.status(500).send('Database error');
                else res.status(200).send(survey);
            })
        }
    }));

    survey.get('/subjectById/:subject', wagner.invoke(function(Subject){
        return function (req,res){
            Subject.findOne({_id: req.params.subject}, function (err, subject){
                if(err) res.status(500).send('Database error');
                else res.status(200).send(subject);
            })
        }
    }));
    
    survey.get('/ping', wagner.invoke(function () {
        return function(req, res){
            res.status(200).send("pong!");
        }}));

    survey.get('/getResults/:subject', wagner.invoke(function (Survey) {
        return function (req, res) {
            console.log("GET - /object/:subject");
            console.log('La asignatura que me pide results.controller es: '+ req.body.surveySubject);
        }
    }));

    survey.post('/', wagner.invoke(function (Survey){
        return function (req, res){
            Survey.findOne({subject: req.body.subject}, function(err, subject){
                if(!subject){
                    var newSurvey = Survey({
                        subject: req.body.subject,
                        teacher: req.body.teacher,
                        period: req.body.period,
                        questions: req.body.questions
                    });

                    newSurvey.save(function (err) {
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
                    res.status(500).send('This survey already exists');
                }
            })
        }
    }));

    survey.post('/askSurvey', wagner.invoke(function(Survey,Subject){
        return function(req, res) {
            Subject.findOne({_id: req.body.subject}, function(err, subject){
                if(!subject){
                    console.log("subject not found asksurvey");
                    //Prueba coger Subject
                    var options = {
                            host: "localhost",
                            port: 3002,
                            path: '/user/getSubjects/' + req.body.subject,
                            agent: false
                        },
                        subjects = '';

                    http.get(options, function(response){
                        response.on('data', function (chunk) {
                            subjects += chunk;
                        });
                        response.on('end', function() {
                            // Data reception is done, do whatever with it!
                            var parsed = JSON.parse(subjects);
                            var newSubject = new Subject({
                                _id: parsed._id,
                                name: parsed.name,
                                teacher: parsed.teacher,
                                n: parsed.n,
                                e: parsed.e
                            });
                            newSubject.save(function(err){
                                if(!err){
                                    signedPs = bigInt(req.body.seudonimo);
                                    subjectN = bigInt(newSubject.n);
                                    subjectE = bigInt(newSubject.e);

                                    Ps = bigInt(signedPs.modPow(subjectE,subjectN));
                                    console.log("la clave publica del cliente es:",Ps.toString());
                                    var en = new Buffer("encuesta");
                                    var m  = bigInt(en.toString('hex'), 16);
                                    console.log("m", m.toString(10));
                                    var c = m.modPow(subjectE,Ps);
                                    console.log("c", c.toString(10));
                                    res.status(200).send(c.toString(10));

                                    //res.status(200).send(newSubject);
                                } else {
                                    if (err.name == 'ValidationError') {
                                        res.status(400).send('Validation error');
                                    } else {
                                        res.status(500).send('Server error');
                                    }
                                }
                            });
                        });
                    });
                    //
                }else{
                    console.log(subject + " es el nombre del subject");
                    signedPs = bigInt(req.body.seudonimo);
                    subjectN = bigInt(subject.n);
                    subjectE = bigInt(subject.e);
                    console.log("signedps que llega",signedPs.toString());
                    Ps = bigInt(signedPs.modPow(subjectE,subjectN));
                    console.log("la clave publica del cliente es:",Ps.toString());
                    var en = new Buffer("encuesta");
                    var m  = bigInt(en.toString('hex'), 16);
                    console.log("m", m.toString(10));
                    var c = m.modPow(subjectE,Ps);
                    console.log("c", c.toString(10));
                    res.status(200).send(c.toString());
                }
            });
        }
    }));


    
    return survey;
};



