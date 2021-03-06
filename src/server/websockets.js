/**
 * # Websockets
 *
 * Websockets takes the express-app and optional socket.io as params.
 */

/*! */

var games = require('./games');
var logger = require('./logger');

module.exports = function (app, socketio) {
  // Create instance of Socket.io if undefined
  if (typeof socketio === 'undefined') { socketio = require('socket.io'); };

  var io = socketio(app);

  io.on('connection', function (socket) {
    // Create player from socket and join lobby
    var player = games.createPlayer(socket);

    // Tell socket.io to join lobby!
    socket.join(player.room.id);

    // Send the player to the client
    socket.emit('player', player.json());

    /**
     * ## socket.on('join')
     *
     * Client tells server that player joins a new room. The client sends the
     * room ID, e.g. { roomId: UUID }. When the player joins a room, several
     * messages is sent to the clients:
     *
     * * **leave** tells the old room that the user have left the room,
     *   e.g. { playerId: UUID }.
     *
     * * **player-joined** tells the new room that the user is joining the
     *   room, e.g. { player: PlayerJSON }.
     *
     * And a **join**-message is sent to the new players client, with
     * information about the room, to tell the client that the player have
     * sucessfully joined the new room, e.g. { room: RoomJSON }.
     */

    socket.on('join', function (data) {
      logger.verbose(
          'UUID(%s) is joining the room "%s"', player.uuid, data.roomId,
          { type: 'websocket', meta: { player: player.json(), data: data } });

      try {
        // Check if room exists first! And is not full!
        if (!games.canJoinRoom(data.roomId)) {
          try {
            socket.emit('invalid room', games.get(data.roomId).toJSON());
          } catch (e) {
            socket.emit('invalid room', undefined);
          }

          return;
        }

        // Tell socket.io to leave old room and join the new room
        // TODO Should probably not leave room if room is the lobby
        socket.leave(player.room.id);
        socket.join(data.roomId);

        // Tell the OLD room that the player have left the room
        socket.broadcast.to(player.room.id).emit('player left', { player: player.json() });

        // Player joins the new room
        // TODO Start game if the room have enough players
        // TODO Create new room if this room is almost full
        // TODO Hide (or show in some other way) room if page is full
        games.join(player, data.roomId);

        // Tell the NEW room that the player have joined the room
        // TODO Get player JSON from games!!!!!!!
        // TODO Maybe remove and let the rooms listen for lobby updates that
        // concerns that specific room
        socket.broadcast.to(data.roomId).emit('player joined', player.json());

        // Tell the client of the player that the player have joined the new room
        // by sending room data to the player. And send the canvas points to the
        // client.
        socket.emit('join', { data: games.json(player.room.id), points: player.room.canvasPoints });

        // TODO Surround in try catch and emit error message to client if error
        // joining room
        // socket.emit('error', { type: 'join', message: 'Error joining room!' });
      } catch (e) {
        logger.error(
            'Error joining the room "%s"', data.roomId,
            { type: 'websocket', meta: { player: player.json(), data: data } });

        throw e;
      }
    });

    /**
     * ## socket.on('chat')
     */

    socket.on('chat', function (data) {
      if (!data.message) { return; }

      logger.verbose(
          'UUID(%s) wrote "%s"', data.player.UUID, data.message,
          { type: 'websocket', meta: { player: data.player, message: data.message } });

      try {
        console.log(player.room.word);

        // Check if word is correct
        if (games.guess(player.room.id, data.message)) {
          // TODO move to startNewRound();

          // Tell next player it's his/her turn. Get correct player
          // using games.player()
          games
            .player(player.room.id, false)
            .websocket
            .emit('your turn', games.word(player.room.id));
          // Tell other players it's a new round
          io
            .to(player.room.id)
            .emit('new round', games.player(player.room.id));

          data.correct = true;
        } else {
          data.correct = false;
        }

        // Send message to clients
        socket.broadcast.to(player.room.id).emit('chat', data);

        // TODO Surround in try catch and emit error message to client if error
        // joining room
        // socket.emit('error', { type: 'join', message: 'Error joining room!' });
      } catch (e) {
        logger.error(
            'Error sending chat message "%s"', data.message,
            { type: 'websocket', meta: { player: player.json(), data: data } });

        throw e;
      }
    });

    /**
     * ## socket.on('canvas')
     */

    socket.on('canvas', function (data) {
      logger.verbose(
          'UUID(%s) sent point', player.uuid,
          { type: 'websocket', meta: { player: player.json(), point: data } });

      // TODO Only broadcast point if it is the correct player!

      player.room.addPoint(data);
      socket.broadcast.to(player.room.id).emit('canvas', data);
    });

    /**
     * ## socket.on('disconnect')
     *
     * Leave room and tell the other clients in the room that the player have
     * left the room.
     */

    socket.on('disconnect', function () {
      logger.verbose('UUID(%s) disconnected', player.uuid,
          { type: 'websocket', meta: { player: player.json() } });

      // Leave room (all rooms)
      games.leave(player);

      // Tell the room that the player have left the room
      socket.broadcast.to(player.room.id).emit('player left', { player: player.json() });
    });
  });
};
