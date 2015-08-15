/**
 * # Websockets
 *
 * Websockets takes the express-app and optional socket.io as params.
 */

/*! */

var games = require('./games');

module.exports = function (app, socketio) {
  // Create instance of Socket.io if undefined
  if (typeof socketio === 'undefined') { socketio = require('socket.io'); };

  var io = socketio(app);

  io.on('connection', function (socket) {
    // Create player from socket and join lobby
    var player = games.createPlayer(socket);

    // Tell socket.io to join lobby!
    socket.join(player.room.id);

    /**
     * ## socket.on('join-room')
     *
     * Client tells server that player joins a new room. The client sends the
     * room ID, e.g. { roomId: UUID }.
     */

    socket.on('join-room', function (data) {
      // Tell socket.io to leave old room and join the new room
      // TODO Should probably not leave room if room is the lobby
      socket.leave(player.room.id);
      socket.join(data.roomId);

      // Tell the old room that the player have left the room,
      // e.g. { playerId: UUID }.
      socket.broadcast.to(player.room.id).emit('leave-room', { playerId: player.uuid });

      // Player joins the new room
      games.join(player, data.roomId);
    });
  });
};
