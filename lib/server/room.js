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
 * @return Returns this.
 */
room.create = function (type) {
	var id = Number.random(99) + '-' + Date.now() + '-' + Number.random(99),
		name = (Array.isArray(type)) ? type.pop() : type;

	rooms[id] = { id: id, type: name, players: {}, que: [] };

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
 * @return Returns this.
 */
room.addPlayer = function (player, r) {
	// Get room data
	var data = rooms[r];
	// Add player to room
	data.players[player.getSocketID()] = {
		facebook: player.getFacebookID(),
		picture: player.getPicture(),
		name: player.getFullName()
	};
	// Add player to que
	data.que.push(player.getSocketID());
	// Save
	rooms[r] = data;

	return this;
};

room.players = function (r) {
	return Object.keys(rooms[r].players).map(function (p) { return rooms[r].players[p]; });
};

room.removePlayer = function (player) {
	// TODO
};

room.playerIsNext = function (player, r) {
	var data = rooms[r], // Get room data
		next = data.que.shift(); // Get next player
	// Put player last
	data.que.push(next);
	// Save
	rooms[r] = data;

	return next === player.getSocketID();
};

exports.room = room;
