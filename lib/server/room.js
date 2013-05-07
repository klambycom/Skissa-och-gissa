/*jslint node: true */
'use strict';

var sugar = require('sugar'),
	Player = require('./Player').Player,
	rooms = {},
	room = {};

room.create = function (type) {
	var id = Number.random(99) + '-' + Date.now() + '-' + Number.random(99),
		name = (Array.isArray(type)) ? type.pop() : type;

	rooms[id] = { id: id, type: name, players: {} };

	if (Array.isArray(type) && type.length > 0) { room.create(type); }
};

room.get = function (id) { return rooms[id]; };

room.all = function () { return rooms; };

room.addPlayer = function (player, room) {
	rooms[room].players[player.getSocketID()] = player;
};

room.create(['general-easy', 'general-moderate', 'general-hard']);

exports.room = room;
