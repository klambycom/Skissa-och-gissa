

<!-- Start src/server/games.js -->

# Games

Handle games, and let users join and leave games.

## createPlayer()

Create new player and join lobby

### Return:

* **Player** the created player

## join(player, roomId)

Join a room and leave the old room

### Params:

* **Player** *player* - The player
* **string** *roomId* - ID of the new room

## leave(player)

Leave room (and disconnect)

### Params:

* **Player** *player* - The player

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
