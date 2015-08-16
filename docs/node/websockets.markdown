

<!-- Start src/server/websockets.js -->

# Websockets

Websockets takes the express-app and optional socket.io as params.

## socket.on('join-room')

Client tells server that player joins a new room. The client sends the
room ID, e.g. { roomId: UUID }. When the player joins a room, several
messages is sent to the clients:

* **leave-room** tells the old room that the user have left the room
* **player-joined-room** tells the new room that the user is joining the room

And a **join-room**-message is sent to the new players client, with
information about the room, to tell the client that the player have
sucessfully joined the new room.

<!-- End src/server/websockets.js -->

