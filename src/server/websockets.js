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
     * ## socket.on('join')
     *
     * Client tells server that player joins a new room. The client sends the
     * room ID, e.g. { roomId: UUID }. When the player joins a room, several
     * messages is sent to the clients:
     *
     * * **leave** tells the old room that the user have left the room
     * * **player-joined** tells the new room that the user is joining the room
     *
     * And a **join**-message is sent to the new players client, with
     * information about the room, to tell the client that the player have
     * sucessfully joined the new room.
     */

    socket.on('join', function (data) {
      // Tell socket.io to leave old room and join the new room
      // TODO Should probably not leave room if room is the lobby
      socket.leave(player.room.id);
      socket.join(data.roomId);

      // Tell the old room that the player have left the room,
      // e.g. { playerId: UUID }.
      socket.broadcast.to(player.room.id).emit('leave', { playerId: player.uuid });

      // Player joins the new room
      // TODO Start game if the room have enough players
      // TODO Create new room if this room is almost full
      // TODO Hide (or show in some other way) room if page is full
      games.join(player, data.roomId);

      // Tell the new room that the player have joined the room,
      // e.g. { player: PlayerJSON }
      // TODO Get player JSON from games!!!!!!!
      socket.broadcast.to(data.roomId).emit('player-joined', { player: player });

      // Tell the players client that the player have joined the new room by
      // sending room data to the player, e.g. { room: RoomJSON }
      // TODO Get room JSON from games!!!!!!!
      // TODO Add canvas to the JSON before sending to client!!!!!
      socket.emit('join', 'tmp');

      // TODO Surround in try catch and emit error message to client if error
      // joining room
      // socket.emit('error', { type: 'join', message: 'Error joining room!' });
    });
  });
};
