var passport = require('passport');
var facebook = require('./facebook');
var User = require('../server/db').User;

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    // TODO Handle errors
    done(null, user);
  });
});

passport.use('facebook', facebook);
