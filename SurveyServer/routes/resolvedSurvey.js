var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');

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
            ResolvedSurvey.find({teacher: req.params.teacher}, function (err, resolvedSurveys) {
                if (err) res.status(500).send('Database error');
                else res.status(200).send(resolvedSurveys);
            });
        }
    }));

    resolvedSurvey.get('/resolvedById/:resolvedSurveyID', wagner.invoke(function (ResolvedSurvey) {
        return function (req, res) {
            ResolvedSurvey.findOne({_id: req.params.resolvedSurveyID}, function (err, resolvedSurvey) {
                if (err) res.status(500).send('Database error');
                if (resolvedSurvey){
                    res.status(200).send(resolvedSurveys);
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

    return resolvedSurvey;
};



