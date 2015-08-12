var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Image
 */

var imageSchema = Schema({
  word: { type: String, required: true },
  url: { type: String, required: true },
  player: { type: String, default: 'unknown' },
  created_at: { type: Date, default: Date.now }
});

imageSchema.statics.latest = function (player) {
  return this.model('Image').findOne({ player: player }).sort({ created_at: -1 });
};

imageSchema.statics.findImage = function (id) {
  return this.model('Image').findOne({ _id: id });
};

/**
 * User
 */

var userSchema = Schema({
  facebook: {
    id: String,
    access_token: String,
    firstName: String,
    lastName: String,
    friends: [String],
    permissions: {
      userFriends: Boolean
    }
  },
  twitter: {
    id: String,
    token: String,
    username: String,
    displayName: String,
    lastStatus: String // TODO Remove if this is just the last Tweet
  }
});

userSchema.methods.setFacebook = function (profile) {
  console.log('updateFacebook');

  // TODO Update familyName, givenName, Friends and permissions
  this.facebook.firstName = profile.name.givenName;
  this.facebook.lastName = profile.name.familyName;
  this.facebook.friends = profile._json.friends.data.map(function (x) { return x.id; });
  // Only extra permission is user_friends right now. I don't think
  // i need the users email.
  profile._json.permissions.data.forEach(function (x) {
    if (x.permission === 'user_friends') {
      this.facebook.permissions.userFriends = x.status === 'granted';
    }
  }.bind(this));

  return this;
};

// met addPoints
// stat createAndAddPoints
// stat createAndOrAddPoints
// stat highscore

module.exports = {
  Image: mongoose.model('Image', imageSchema),
  User: mongoose.model('User', userSchema)
};
