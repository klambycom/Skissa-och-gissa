/*jslint node: true */
'use strict';

exports.listen = function (app) {
	var io = require('socket.io').listen(app),
		room = io.of('/room');

	room.on('connection', function (user) {
		// Player joins room
		user.emit('server-message', { text: 'You are ' + user.id });

		// Player sends message
		user.on('user-message', function (data) {
			// Send the message to all player in room
			room.emit('user-message', { text: data });
		});

		// Player disconnect
		user.on('disconnect', function () {
			room.emit('server-message', { text: user.id + ' disconnected.' });
		});
	});

	return io;
};
