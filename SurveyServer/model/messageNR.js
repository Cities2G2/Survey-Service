var mongoose = require('mongoose');

var messageNRSchema = {
    _id: { type: String },
    source: {type: String},
    destiny: {type: String},
    dataC: { type:String },
    key: {type: String},
    dataCK: {type: String},
    identData: {type: String}
};

module.exports = new mongoose.Schema(messageNRSchema, {versionKey: false});
module.exports.categorySchema = messageNRSchema;