var mongoose = require('mongoose');

var messageNRSchema = {
    _id: { type: String },
    destiny: {type: String},
    key: {type: String},
    identData: {type: String}
};

module.exports = new mongoose.Schema(messageNRSchema, {versionKey: false});
module.exports.categorySchema = messageNRSchema;