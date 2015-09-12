

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

## socket.on('chat')

## socket.on('canvas')

## socket.on('disconnect')

Leave room and tell the other clients in the room that the player have
left the room.

<!-- End src/server/websockets.js -->

