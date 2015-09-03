var socket;

if (process && process.browser) {
  socket = require('socket.io-client')('http://localhost:3000');
} else {
  // TODO Remove later. And mock socket another way. For tests!
  socket = { on: function () {}, emit: function () {} };
}

module.exports = socket;
