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

var fs = require('fs'),
	getDictionary = function (type) {
		return JSON.parse(fs.readFileSync('./dictionary.json'))[type];
	};

/**
 * @method create
 * @param type {string|array} Type of room. Must be a valid name from
 *                            dictionary.json. Or an array of rooms.
 * @return Returns this. TODO Why?
 */
room.create = function (type) {
	var id = Number.random(99) + '-' + Date.now() + '-' + Number.random(99),
		name = (Array.isArray(type)) ? type.pop() : type,
		words = getDictionary(name).words;

	rooms[id] = { id: id, type: name, players: {}, queue: [], word: '', words: words };

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
	// Throw error if room do not exists
	if (typeof data === 'undefined') {
		throw { name: 'GameNotFoundException', message: 'Can\'t add player since the game is not found.' };
	} else if (typeof player === 'undefined') {
		throw { name: 'PlayerNotFoundException', message: 'Can\'t add non-existing player to the game.' };
	} else if (data.players.length > 9) {
		throw { name: 'GameIsFullException', message: 'Can\'t add player since the game is full.' };
	}
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
	if (typeof rooms[r] === 'undefined') {
		throw { name: 'GameNotFoundException', message: 'Can\'t get players since the game is not found.' };
	}

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

/**
 * @method randomWord
 * @param roomId {string}
 * @return Returns a random word.
 */
room.randomWord = function (r) {
	// A random word
	rooms[r].word = rooms[r].words.sample();
	// Remove word from words-array
	rooms[r].words = rooms[r].words.remove(rooms[r].word);

	return rooms[r].word;
};

exports.room = room;
