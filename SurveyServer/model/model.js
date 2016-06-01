var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
    mongoose.connect('mongodb://localhost:27017/surveyService');

    wagner.factory('db', function() {
        return mongoose;
    });

    var Survey =
        mongoose.model('Survey', require('./survey'), 'surveys');

    var ResolvedSurvey =
        mongoose.model('ResolvedSurvey', require('./resolvedSurvey'), 'resolvedSurveys');

    var Subject =
        mongoose.model('Subject', require('./subject'), 'subjects');

    var MessageNR =
        mongoose.model('MessageNR', require('./messageNR'), 'MessagesNR');

    var models = {
        Survey: Survey,
        Subject: Subject,
        ResolvedSurvey: ResolvedSurvey,
        MessageNR: MessageNR
    };

    // To ensure DRY-ness, register factories in a loop
    _.each(models, function(value, key) {
        wagner.factory(key, function() {
            return value;
        });
    });

    return models;
};