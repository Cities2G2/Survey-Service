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

    return survey;
};