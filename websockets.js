/*jslint node: true, es5: true */
'use strict';

var Player = require('./lib/server/Player').Player,
	dictionaries = require('./dictionary.json'),
	sugar = require('sugar'),
	fs = require('fs'),
	randomWordFrom = function (c) { return dictionaries[c].words.sample(); };

exports.listen = function (app, Room) {
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
			var temp = 5;
			if (temp <= 10) {
				// Leave the current room (stored in session)
				socket.leave(socket.room);
				//rooms[socket.room] = rooms[socket.room].filter(function (p) { return p.getSocketID() !== socket.id; });

				// Send message to old room
				socket.broadcast.to(socket.room).emit('server-message', {
					text: socket.player.getFullName() + ' har lämnat spelet.'
				});

				// Join new room
				socket.join(room);
				socket.room = room;
				//rooms[room].push(socket.player);

				// Add player to room
				Room.addPlayer(socket.player, socket.room);
				console.log(Room.all());

				// Echo to the room that a player has connected to their room
				socket.broadcast.to(room).emit('server-message', { text: socket.player.getFullName() + ' har anslutet!' });

				// TODO Echo to client some information about the room (who is drawing, when its my turn, etc.)
				//socket.emit('server-message', { text: 'Välkommen ' + socket.player.getFullName() + '!' });

				// Tell browser it worked
				socket.emit('join-room', { success: true });
			} else {
				// Tell browser it didn't worked
				socket.emit('join-room', { success: false, message: 'Rummet är fullt!' });
			}
		});

		// Player disconnect
		socket.on('disconnect', function () {
			Room.removePlayer(socket.player, socket.room);
			console.log(Room.all());
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
			// Is the guess correct?
			var correct = data === (Room.getWord(socket.room) || 'korrekt'),
				nextPlayer;

			// Send the message to all player in room
			io.sockets.in(socket.room).emit('user-message', {
				text: data,
				player: socket.player.getAllData(),
				win: correct
			});

			// Let next person draw
			if (correct) {
				// Pick next person in queue
				nextPlayer = Room.nextPlayer(socket.room);

				// Tell player its his/hers turn to draw
				io.sockets.socket(nextPlayer.getSocketID()).emit('correct-word', {
					word: data,
					next: {
						draw: true,
						word: Room.setWord(socket.room, randomWordFrom('general-easy')),
						player: nextPlayer.getAllData()
					}
				});

				// Tell all players that correct word is guessed and send word to next person
				io.sockets.in(socket.room).except(nextPlayer.getSocketID()).emit('correct-word', {
					word: data,
					next: {
						draw: false,
						player: nextPlayer.getAllData()
					}
				});
			}
		});

		// Save image to server
		socket.on('save-image', function (data) {
			// TODO Check if it really was players turn to draw

			// Strip off the url prefix to get just the base64-encoded bytes
			var image = data.replace(/^data:image\/\w+;base64,/, ''),
				path = 'public/images/',
				// TODO Change socket.id to a database id
				// TODO Change word to right word
				filename = socket.id + '-' + 'word' + '-' + Date.now() + '.png';

			// Save image
			fs.writeFile(path + filename, image, 'base64', function (err) {
				if (err) {
					// Something went wrong
					console.log(err);
				} else {
					// The image was saved
					console.log('Image saved');
					// TODO Send message to player and ask to tell facebook?
				}
			});
		});
	});

	return io;
};
