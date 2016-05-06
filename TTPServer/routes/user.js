var passport = require('passport');
var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');

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

    user.post('/subject', wagner.invoke(function(Subject){
        return function(req, res) {
            Subject.findOne({name: req.body.name}, function(err, subject){
                if(!subject){
                    var newSubject = new Subject({
                        name: req.body.name,
                        teacher: req.body.teacher
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
                    Subject.findOne({name: req.body.name}, function(err,subject){
                        if(!subject){
                            res.status(404).send('Subject not found');
                        } else {
                            //Comprobar que la asignatura no existe
                            user.subjects.push(subject);
                            user.save(function(err){
                                if(!err){
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
                    })
                }
            })
        }
    }));

    user.post('/register', wagner.invoke(function (User) {
        return function(req, res) {
            User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
                if (err) {
                    return res.status(500).send(err);
                }
                passport.authenticate('local')(req, res, function () {
                    res.status(200).send(user.subjects);
                });
            });
    }}));

    user.post('/login', passport.authenticate('local'), function(req, res) {
        wagner.invoke(function(User){
            User.findOne({username: req.body.username}, function(err, user){
                res.status(200).send(user.subjects);
            })
        });
    });

    user.get('/ping', wagner.invoke(function () {
        return function(req, res){
            res.status(200).send("pong!");
        }}));

    return user;
};