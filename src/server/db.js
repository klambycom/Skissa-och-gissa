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
    email: String
  },
  twitter: {
    id: String,
    token: String,
    username: String,
    displayName: String,
    lastStatus: String // TODO Remove if this is just the last Tweet
  }
});

// met addPoints
// stat createAndAddPoints
// stat createAndOrAddPoints
// stat highscore

module.exports = {
  Image: mongoose.model('Image', imageSchema),
  User: mongoose.model('User', userSchema)
};
