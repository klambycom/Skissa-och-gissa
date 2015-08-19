

<!-- Start src/server/websockets.js -->

# Websockets

Websockets takes the express-app and optional socket.io as params.

## socket.on('join')

Client tells server that player joins a new room. The client sends the
room ID, e.g. { roomId: UUID }. When the player joins a room, several
messages is sent to the clients:

* **leave** tells the old room that the user have left the room,
  e.g. { playerId: UUID }.

* **player-joined** tells the new room that the user is joining the
  room, e.g. { player: PlayerJSON }.

And a **join**-message is sent to the new players client, with
information about the room, to tell the client that the player have
sucessfully joined the new room, e.g. { room: RoomJSON }.

<!-- End src/server/websockets.js -->

