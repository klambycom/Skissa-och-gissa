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
			try {
				// Add player to room
				Room.addPlayer(socket.player, room);
				console.log(Room.all()); // TODO Remove

				// Leave the current room (stored in session)
				socket.leave(socket.room);
				Room.removePlayer(socket.player, socket.room);

				// Send message to old room
				socket.broadcast.to(socket.room).emit('server-message', {
					text: socket.player.getName() + ' har lämnat spelet.'
				});

				// Join new room
				socket.join(room);
				socket.room = room;

				// Echo to the room that a player has connected to their room
				socket.broadcast.to(room).emit('player-joined-room', { player: socket.player.getAllData() });

				// Tell browser it worked
				socket.emit('join-room', { success: true, players: Room.players(socket.room) });
			} catch (e) {
				socket.emit('error-message', { name: e.name, message: e.message });
			}
		});

		// Player disconnect
		socket.on('disconnect', function () {
			try {
				Room.removePlayer(socket.player, socket.room);
				console.log(Room.all()); // TODO Remove
				socket.broadcast.to(socket.room).emit('server-message', { text: socket.player.getName() + ' har lämnat spelet.' });
			} catch (e) {
				console.log(e);
			}
		});

		// TODO
		socket.on('update-player-data', function (data) {
			socket.broadcast.to(socket.room).emit('server-message', { text: data.name + ' har bytt namn.' });
		});




		// Get drawing-points from player, and send to the others
		socket.on('canvas', function (data) {
			if (Room.playersTurn(socket.player, socket.room)) {
				socket.broadcast.to(socket.room).emit('canvas', data);
			}
		});

		// Player sends message
		socket.on('user-message', function (data) {
			if (data.isBlank() || Room.playersTurn(socket.player, socket.room)) { return; }

			// Is the guess correct?
			var word = data.compact(),
				correct = word.toLowerCase() === (Room.getWord(socket.room) || 'korrekt').toLowerCase(),
				nextPlayer;

			// Send the message to all player in room
			io.sockets.in(socket.room).emit('user-message', {
				text: word,
				player: socket.player.getAllData(),
				win: correct
			});

			// Let next person draw
			if (correct) {
				// Pick next person in queue
				nextPlayer = Room.nextPlayer(socket.room);

				// Tell player its his/hers turn to draw
				io.sockets.socket(nextPlayer.getSocketID()).emit('correct-word', {
					word: word,
					next: {
						draw: true,
						word: Room.setWord(socket.room, randomWordFrom('general-easy')),
						player: nextPlayer.getAllData()
					}
				});

				// Tell all players that correct word is guessed and send word to next person
				io.sockets.in(socket.room).except(nextPlayer.getSocketID()).emit('correct-word', {
					word: word,
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
