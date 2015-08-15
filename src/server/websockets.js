var games = require('./games');

module.exports = function (app, socketio) {
  // Create instance of Socket.io if undefined
  if (typeof socketio === 'undefined') { socketio = require('socket.io'); };

  var io = socketio(app);

  io.on('connection', function (socket) {
    // Create player from socket and join lobby
    var player = games.createPlayer(socket);

    // TODO Join lobby!

    // Player joins a room
    // join-room data = { roomId: UUID }; // Client to server
    // leave-room data = { playerId: UUID }; // Server to client
    socket.on('join-room', function (data) {
      // Tell socket.io to leave old room and join the new room
      socket.leave(player.room.id);
      socket.join(data.roomId);

      // Tell the old room that the player have left the room
      socket.broadcast.to(player.room.id).emit('leave-room', { playerId: player.uuid });

      // Player joins the new room
      games.join(player, data.roomId);
    });
  });
};
