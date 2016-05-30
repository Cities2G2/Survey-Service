var mongoose = require('mongoose');


Question = new mongoose.Schema({
    formulation: {
        type: String
    },
    value: {
        type: Number
    }
});

var resolvedSurveySchema = {
    subject: {
        type: String
    },
    teacher:{
        type: String
    },
    period: {
        type: String
    },
    questions: [
        Question
    ]
};

module.exports = new mongoose.Schema(resolvedSurveySchema, {versionKey: false});
module.exports.categorySchema = resolvedSurveySchema;