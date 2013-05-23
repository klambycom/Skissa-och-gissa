/*jslint node: true, es5: true */
'use strict';

require('./lib/utils/functional');

var Player = require('./lib/server/Player').Player,
	dictionaries = require('./dictionary.json'),
	sugar = require('sugar'),
	fs = require('fs'),
	randomWordFrom = function (c) { return dictionaries[c].words.sample(); },
	timer = {};

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


		var newWord = function (r, w) {
			// Start timer
			clearTimeout(timer[r]);
			timer[r] = setTimeout(newWord.curry(r), (dictionaries['general-easy'].time * 60000) + 2000);

			// Pick next person in queue
			var nextPlayer = Room.nextPlayer(r),
				word = w || Room.getWord(r);

			// Cancel if room is empty
			if (typeof nextPlayer === 'undefined') {
				clearTimeout(timer[r]);
				return;
			}

			// Check if there is just one player
			if (Room.players(r).length === 1) {
				socket.broadcast.to(r).emit('correct-word', { word: word });
				socket.broadcast.to(r).emit('server-message', {
					text: 'Du är just nu ensam i detta spelet. Vänta en stund så kommer det förhoppningsvis fler spelare.'
				});
				clearTimeout(timer[r]);
				return;
			}

			// Tell player its his/hers turn to draw
			io.sockets.socket(nextPlayer.getSocketID()).emit('correct-word', {
				word: word,
				next: {
					draw: true,
					word: Room.setWord(r, randomWordFrom('general-easy')),
					player: nextPlayer.getAllData(),
					minutes: dictionaries['general-easy'].time
				}
			});

			// Tell all players that correct word is guessed and send word to next person
			io.sockets.in(r).except(nextPlayer.getSocketID()).emit('correct-word', {
				word: word,
				next: {
					draw: false,
					player: nextPlayer.getAllData(),
					minutes: dictionaries['general-easy'].time
				}
			});
		};


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

				// Start game if its the second player
				if (Room.players(socket.room).length === 2) {
					newWord(socket.room, '');
				} else if (Room.players(socket.room).length === 1) {
					socket.emit('server-message', { text: 'Du är just nu ensam i detta spelet. Vänta en stund så kommer det förhoppningsvis fler spelare.' });
				}
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
				correct = word.toLowerCase() === (Room.getWord(socket.room) || 'korrekt').toLowerCase();

			// Send the message to all player in room
			io.sockets.in(socket.room).emit('user-message', {
				text: word,
				player: socket.player.getAllData(),
				win: correct
			});

			// Let next person draw
			if (correct) { newWord(socket.room); }
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
