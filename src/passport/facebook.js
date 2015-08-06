var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../server/db').User;
var config = require('../config').facebook();

// Facebook will send back the tokens and profile
var callback = function (access_token, refresh_token, profile, done) {
  console.log('profile', profile);

  // asynchronous
  process.nextTick(function () {
    // Find the user in the DB based on their facebook id
    User.findOne({ 'id': profile.id }, function (err, user) {
      if (err) { return done(err); } // Stop everything on error connecting to the db

      if (user) {
        console.log('OLD USER!');
        return done(null, user); // Return found user
      } else {
        var newUser = new User();
        newUser.facebook.id = profile.id;
        newUser.facebook.access_token = access_token;
        newUser.facebook.firstName = profile.name.givenName;
        newUser.facebook.lastName = profile.name.familyName;
        newUser.facebook.email = profile.emails[0].value;
        newUser.save(function (err) {
          if (err) { throw err; }
          return done(null, newUser);
        });
      }
    });
  });
};

module.exports = new FacebookStrategy({
  clientID: config.appID,
  clientSecret: config.appSecret,
  callbackURL: config.callbackUrl
}, callback);
