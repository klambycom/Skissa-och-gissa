/*jslint node: true, es5: true */
'use strict';

var Player = require('./lib/server/Player').Player,
	rooms = {};

exports.listen = function (app) {
	var io = require('socket.io').listen(app);

	io.sockets.on('connection', function (socket) {
		// Player joins
		socket.emit('identify-player', { id: socket.id });

		// Browser sends player data
		socket.on('identify-player', function (data) {
			// Store player in the socket session for this client
			socket.player = new Player(data);

			// Store room in the socket session for this client
			socket.room = 'lobby';

			// Join lobby
			socket.join('lobby');

			// Store player in lobby
			//rooms.lobby.push(socket.player);
		});

		// Join a game
		socket.on('join-room', function (room) {
			// Leave the current room (stored in session)
			socket.leave(socket.room);
			//rooms[socket.room] = rooms[socket.room].filter(function (p) { return p.getSocketID() !== socket.id; });

			// Send message to old room
			socket.broadcast.to(socket.room).emit('server-message', { text: socket.player.getFullName() + ' har lämnat spelet.' });

			// Join new room
			socket.join(room);
			socket.room = room;
			//rooms[room].push(socket.player);

			// Echo to the room that a player has connected to their room
			socket.broadcast.to(room).emit('server-message', { text: socket.player.getFullName() + ' har anslutet!' });

			// TODO Echo to client some information about the room (who is drawing, when its my turn, etc.)
			//socket.emit('server-message', { text: 'Välkommen ' + socket.player.getFullName() + '!' });
		});

		// Player disconnect
		socket.on('disconnect', function () {
			console.log(socket.room);
			socket.broadcast.to(socket.room).emit('server-message', { text: socket.player.getFullName() + ' har lämnat spelet.' });
		});

		// TODO
		socket.on('update-player-data', function (data) {
			socket.broadcast.to(socket.room).emit('server-message', { text: data.name + ' har bytt namn.' });
		});




		// Get drawing-points from player, and send to the others
		socket.on('canvas', function (data) {
			//room.emit('canvas', data);
			socket.broadcast.to(socket.room).emit('canvas', data);
		});

		// Player sends message
		socket.on('user-message', function (data) {
			// Send the message to all player in room
			io.sockets.in(socket.room).emit('user-message', { text: data, player: socket.player.getAllData() });
		});
	});

	return io;
};
