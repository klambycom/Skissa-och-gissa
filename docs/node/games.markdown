

<!-- Start src/server/games.js -->

# Games

Handle games, and let users join and leave games.

## join(playerId, roomId, oldRoomId)

Join a room and leave the old room

### Params:

* **string** *playerId* - ID of the player
* **string** *roomId* - ID of the new room
* **string** *oldRoomId* - ID of the old room

## leave(playerId)

Leave room (and disconnect)

### Params:

* **string** *playerId* - ID of the player

## players(roomId)

All players in a specific room

### Params:

* **string** *roomId* - ID of the room

## all()

All players in all rooms

## get(roomId)

Get room with roomId

### Params:

* **string** *roomId* - ID of the room

## get()

Fired when room is created or removed, when player is added or removed
from room and when new image for a room is created

<!-- End src/server/games.js -->

