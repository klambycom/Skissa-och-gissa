

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

### Return:

* **array** all players in the room

## get(roomId)

Get room with roomId, or throw an error.

### Params:

* **string** *roomId* - ID of the room

### Return:

* **Room** the room

## addListener(event, listener)

Fired when room is created or removed, when player is added or removed
from room and when new image for a room is created

### Params:

* **string** *event* 
* **function** *listener* 

<!-- End src/server/games.js -->

