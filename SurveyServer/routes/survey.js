var bodyparser = require('body-parser');
var express = require('express');
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
    
    survey.get('/ping', wagner.invoke(function () {
        return function(req, res){
            res.status(200).send("pong!");
        }}));



    //Dani
    survey.post('/askSurvey', wagner.invoke(function(Survey,Subject){
        console.log("POST survey/askSurvey");

        return function(req, res) {

            console.log('El seudónimo que me ha enviado subjects.controller es: '+ req.body.seudonimo);
            console.log('El subject que me ha enviado subjects.controller es: '+ req.body.subject);
            Subject.findOne({_id: req.body.subject}, function(err, subject){
                if(!subject){
                   console.log("subject not found");
                }else{
                    console.log(subject + " es el nombre del subject")
                }
                signedPs = bigInt(req.body.seudonimo);
                subjectN = bigInt(subject.n);
                subjectE = bigInt(subject.e);

                Ps = bigInt(signedPs.modPow(subjectE,subjectN));
                console.log("la clave publica del cliente es:",Ps.toString());


            });



            //res.status(200).send('El seudónimo que me ha enviado subjects.controller es: '+ req.body.seudonimo);

            /*Survey.findOne({subject: req.body.pseudonym}, function(err, survey){
                if(!survey){
                    res.status(404).send('Survey not found'+' seudonim rebut: '+ req.body.pseudonym);

                    survey.save(function(err){
                        if(!err){
                            res.status(200).send(survey);
                        } else {
                            if (err.name == 'ValidationError') {
                                res.status(400).send('Validation error');
                            } else {
                                res.status(500).send('Server error');
                            }
                        }
                    })
                } else {
                    res.status(400).send('There a Survey with this name');
                }
            })*/
        }
    }));



    return survey;
};



