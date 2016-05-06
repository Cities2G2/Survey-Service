var passport = require('passport');
var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');
var rsa = require('../src/rsa-big-integer.js');
var bigInt = require('../src/big-integer-scii.js');

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

    user.post('/pseudo', wagner.invoke(function (Object) {
        return function (req, res) {
            var subjectId = req.body.subjectId;
            var pseudo = req.body.pseudo;
            var Pseudo= bigInt(pseudo);//Recupero el pseudonimo en forma de bigint
            Subject.find(function (err, keys) {//Busco el Subject via el ID
                if (err) res.status(500).send('Subject not found');
                else{
                    var signedMsg = Pseudo.modPow(keys.privateKey.d,keys.publicKey.n);//Firmo el pseudonimo con la privada del Subject
                    res.status(200).send(signedMsg);
                }
            });
        }
    }));




    return user;
};