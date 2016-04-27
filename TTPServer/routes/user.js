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

    user.post('/register', wagner.invoke(function (User) {
        return function(req, res) {
            console.log(req.body);
            User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
                if (err) {
                    return res.status(500).send(err);
                }
                passport.authenticate('local')(req, res, function () {
                    res.status(200).send('OK');
                });
            });
        }}));

    user.post('/login', passport.authenticate('local'), function(req, res) {
        res.status(200).send('OK');
    });

    user.get('/ping', wagner.invoke(function () {
        return function(req, res){
            res.status(200).send("pong!");
        }}));

    return user;
};