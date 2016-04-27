var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

User = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String
    }
});

User.plugin(passportLocalMongoose);
User.set('toObject', { virtuals: true });
User.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', User);
