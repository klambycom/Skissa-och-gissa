var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var Image = require('../../src/server/db').Image;

Image.latest('test').then(function (image) {
  console.log('image', image);
}, function (error) {
  console.log('error', error);
});

var Player = require('../../src/server/db').Player;

mongoose.connection.close();
