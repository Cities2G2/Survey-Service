var mongoose = require('mongoose');

Answer = new mongoose.Schema({
    value: {
        type: String
    },
    state: {
        type: Boolean
    }
});

Question = new mongoose.Schema({
    formulation: {
        type: String
    },
    answers: [
        Answer
    ]
});

var surveySchema = {
    subject: {
        type: String
    },
    questions: [
        Question
    ]
};

module.exports = new mongoose.Schema(surveySchema, {versionKey: false});
module.exports.categorySchema = surveySchema;