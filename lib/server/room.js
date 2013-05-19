/*jslint node: true */
'use strict';

/**
 * @namespace server
 * @class room
 * @static
 */

var sugar = require('sugar'),
	Player = require('./Player').Player,
	rooms = {},
	room = {};

/**
 * @method create
 * @param type {string|array} Type of room. Must be a valid name from
 *                            dictionary.json. Or an array of rooms.
 * @return Returns this. TODO Why?
 */
room.create = function (type) {
	var id = Number.random(99) + '-' + Date.now() + '-' + Number.random(99),
		name = (Array.isArray(type)) ? type.pop() : type;

	rooms[id] = { id: id, type: name, players: {}, queue: [], word: '' };

	if (Array.isArray(type) && type.length > 0) { room.create(type); }

	return this;
};

/**
 * @method get
 * @param id {string} The rooms id.
 * @return Returns the room.
 */
room.get = function (id) { return rooms[id]; };

/**
 * @method all
 * @return Returns all rooms.
 */
room.all = function () { return rooms; };

/**
 * @method addPlayer
 * @param player {Player}
 * @param roomID {string}
 * @return Returns this. TODO Why?
 */
room.addPlayer = function (player, r) {
	// Get room data
	var data = rooms[r];
	// Add player to room
	//data.players[player.getSocketID()] = {
	//	facebook: player.getFacebookID(),
	//	picture: player.getPicture(),
	//	name: player.getFullName()
	//};
	data.players[player.getSocketID()] = player;
	// Add player to queue
	data.queue.push(player.getSocketID());
	// Save
	rooms[r] = data;

	return this;
};

/**
 * @method players
 * @param roomId {string}
 * @return Return players in room.
 */
room.players = function (r) {
	return Object.keys(rooms[r].players).map(function (p) { return rooms[r].players[p].getAllData(); });
};

/**
 * @method removePlayer
 * @param player {Player}
 * @param roomId {string}
 * @return Returns the player.
 */
room.removePlayer = function (player, room) {
	if (rooms[room] && rooms[room].players[player.getSocketID()]) {
		// Remove player form room
		delete rooms[room].players[player.getSocketID()];
		// Remove player from queue
		rooms[room].queue.remove(player.getSocketID());
	}

	return player;
};

/**
 * @method change
 * @param player {Player}
 * @param fromRoomId {string}
 * @param toRoomId {string}
 */
room.change = function (player, from, to) {
	room.removePlayer(player, from);
	room.addPlayer(player, to);
};

/**
 * @method playerIsNext
 * @param player {Player}
 * @param roomId {string}
 * @return Returns true if its players turn to draw.
 */
room.playerIsNext = function (player, r) {
	var data = rooms[r], // Get room data
		next = data.queue.shift(); // Get next player
	// Put player last
	data.queue.push(next);
	// Save
	rooms[r] = data;

	return next === player.getSocketID();
};

/**
 * @method nextPlayer
 * @param roomId {string}
 * @return Returns the next player in the queue.
 */
room.nextPlayer = function (room) {
	var data = rooms[room], // Get room data
		next = data.queue.shift(); // Get next player
	// Put player last
	data.queue.push(next);
	// Save
	rooms[room] = data;

	return rooms[room].players[next];
};

/**
 * @method playersTurn
 * @param player {Player}
 * @param roomId {string}
 * @return Returns true if its the players turn to draw.
 */
room.playersTurn = function (p, r) {
	return rooms[r].queue[rooms[r].queue.length - 1] === p.getSocketID();
};

/**
 * @method setWord
 * @param roomId {string}
 * @param word {string}
 * @return Returns the word.
 */
room.setWord = function (room, word) {
	rooms[room].word = word;
	return word;
};

/**
 * @method getWord
 * @param roomId {string}
 * @return Returns the word.
 */
room.getWord = function (room) {
	return rooms[room].word;
};

exports.room = room;
