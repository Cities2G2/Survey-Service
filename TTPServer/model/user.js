var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

Subject = new mongoose.Schema({
    id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subject'
    },
    name: {
        type: String,
        required: true,
        lowercase: true
    },
    done: {
        type: Boolean
    }
});

User = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String
    },
    subjects:[Subject]
});

User.plugin(passportLocalMongoose);
User.set('toObject', { virtuals: true });
User.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', User);
