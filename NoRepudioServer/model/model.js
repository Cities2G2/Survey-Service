var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
    mongoose.connect('mongodb://localhost:27017/surveyServiceNR');

    wagner.factory('db', function() {
        return mongoose;
    });
    
    var MessageNR =
        mongoose.model('MessageNR', require('./messageNR'), 'MessagesNR');

    var models = {
        MessageNR: MessageNR
    };
    
    _.each(models, function(value, key) {
        wagner.factory(key, function() {
            return value;
        });
    });

    return models;
};