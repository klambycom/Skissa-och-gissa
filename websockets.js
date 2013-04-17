/*jslint node: true */
'use strict';

var Player = require('./lib/server/Player').Player,
	player;

exports.listen = function (app) {
	var io = require('socket.io').listen(app),
		room = io.of('/room');

	room.on('connection', function (user) {
		// Player joins room
		user.emit('identify-player', { id: user.id });
		user.on('identify-player', function (data) {
			// Create player with new data
			player = new Player(data);
			console.log(player.get('all'));
			user.emit('server-message', { text: 'Välkommen ' + player.get('name') + '!' });
		});

		// Player sends message
		user.on('user-message', function (data) {
			// Send the message to all player in room
			room.emit('user-message', { text: data, player: player.get('all') });
		});

		// Player disconnect
		user.on('disconnect', function () {
			room.emit('server-message', { text: player.get('name') + ' har lämnat spelet.' });
		});
	});

	return io;
};
