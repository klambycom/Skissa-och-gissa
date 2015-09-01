var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../server/db').User;
var config = require('../config').facebook();

var saved = function (done) {
  return function (user) { return done(null, user); };
};

var error = function (done) {
  return function (err) { return done(err); };
};

// Facebook will send back the tokens and profile
var callback = function (access_token, refresh_token, profile, done) {
  process.nextTick(function () {
    // Find the user in the DB based on their facebook id
    User.findOne({ 'facebook.id': profile.id }, function (err, user) {
      if (err) { return done(err); } // Stop everything on error connecting to the db

      if (!user) {
        // Create new user
        user = new User();
        user.facebook.id = profile.id;
        user.facebook.access_token = access_token;
      }

      // Set needed information from the Facebook profile
      user.setFacebook(profile).save().then(saved(done), error(done));
    });
  });
};

module.exports = new FacebookStrategy({
  clientID: config.appID,
  clientSecret: config.appSecret,
  callbackURL: config.callbackUrl,
  profileURL: 'https://graph.facebook.com/me?fields=' + config.fields
}, callback);
