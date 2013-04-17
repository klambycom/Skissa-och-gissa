/*jslint node: true */
'use strict';

var Player = require('./lib/server/Player').Player,
	players = [];

exports.listen = function (app) {
	var io = require('socket.io').listen(app),
		room = io.of('/room');

	room.on('connection', function (user) {
		var player;

		// Player joins room
		user.emit('identify-player', { id: user.id });

		// Browser send player data
		user.on('identify-player', function (data) {
			// Create player with new data
			player = new Player(data);

			// Remove player from array
			players = players.filter(function (p) { return p.getSocketID !== user.id; });

			// Add player to array
			players.push(player);

			// Welcome player
			user.emit('server-message', { text: 'Välkommen ' + player.getFullName() + '!' });
		});

		// Player sends message
		user.on('user-message', function (data) {
			// Send the message to all player in room
			room.emit('user-message', { text: data, player: player.getAllData() });
		});

		// Player disconnect
		user.on('disconnect', function () {
			room.emit('server-message', { text: player.getFullName() + ' har lämnat spelet.' });
		});
	});

	return io;
};
