function setupAuth(User, app) {
    var mongoose = require('mongoose');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.
        findOne({ _id : id }).
        exec(done);
    });

    passport.use(new LocalStrategy(User.authenticate()));

    app.use(require('express-session')({
        secret: 'this is a secret',
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
}

module.exports = setupAuth;