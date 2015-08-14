var games = require('./games');

module.exports = function (app, socketio) {
  // Create instance of Socket.io if undefined
  if (typeof socketio === 'undefined') { socketio = require('socket.io'); };

  var io = socketio(app);

  io.on('connection', function (socket) {
    var player = games.createPlayer(socket);
  });
};
