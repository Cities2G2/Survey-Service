var mongoose = require('mongoose');

subjectSchema = {
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    teacher: {
        type: String
    },
    n:{
        type: String
    },
    e: {
        type: String
    },
    d: {
        type: String
    },
};

module.exports = new mongoose.Schema(subjectSchema, {versionKey: false});
module.exports.categorySchema = subjectSchema;