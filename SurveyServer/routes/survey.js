var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');

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
    survey.post('/askSurvey', wagner.invoke(function(Survey){
        console.log("POST survey/askSurvey");

        return function(req, res) {

            console.log('El seudónimo que me ha enviado subjects.controller es: '+ req.body.seudonimo);
            res.status(200).send('El seudónimo que me ha enviado subjects.controller es: '+ req.body.seudonimo);

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



