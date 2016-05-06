var mongoose = require('mongoose');

var surveySchema = {
    subject: {
        type: String
    },
    destiny: [
        Question
    ]
};

Question = new mongoose.Schema({
    formulation: {
        type: String
    },
    done: [
        Answer
    ]
});

Answer = new mongoose.Schema({
    value: {
        type: String
    },
    state: {
        type: Boolean
    }
});

module.exports = new mongoose.Schema(surveySchema, {versionKey: false});
module.exports.categorySchema = surveySchema;