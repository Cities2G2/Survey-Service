var mongoose = require('mongoose');

subjectSchema = {
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    teacher: {
        type: String
    }
};

module.exports = new mongoose.Schema(subjectSchema, {versionKey: false});
module.exports.categorySchema = subjectSchema;