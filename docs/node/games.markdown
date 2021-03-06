

<!-- Start src/server/games.js -->

# Games

Handle games, and let users join and leave games.

## json(roomId)

Get all games as JSON, or just one room

### Params:

* **string** *roomId* Optional room id

### Return:

* **array** an array with the JSON of each room

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

## isValidRoom(roomId)

Check if room is found and valid. And check if room is not full!

### Params:

* **string** *roomId* 

### Return:

* **** true if room is found and valid

## guess()

## word()

## player()

<!-- End src/server/games.js -->

