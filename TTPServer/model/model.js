var mongoose = require('mongoose');
var _ = require('underscore');
var rsa = require("../src/rsa-big-integer");

module.exports = function(wagner) {
    mongoose.connect('mongodb://localhost:27017/surveyServiceTTP');

    wagner.factory('db', function() {
        return mongoose;
    });

    var User =
        mongoose.model('User', require('./user'), 'users');

    var Subject =
        mongoose.model('Subject', require('./subject'), 'subjects');

    var models = {
        User: User,
        Subject: Subject
    };

    // To ensure DRY-ness, register factories in a loop
    _.each(models, function(value, key) {
        wagner.factory(key, function() {
            return value;
        });
    });




    return models;
};