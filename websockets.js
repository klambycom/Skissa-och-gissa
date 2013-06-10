/*jslint node: true, es5: true */
'use strict';

require('./lib/utils/functional');

var Player = require('./lib/server/Player').Player,
	dictionaries = require('./dictionary.json'),
	sugar = require('sugar'),
	fs = require('fs'),
	timer = {};

exports.listen = function (app, game) {
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

			// Show available games
			socket.emit('add-room', game.available());
		});


		var newWord = function (r, w) {
			// Start timer
			clearTimeout(timer[r]);
			timer[r] = setTimeout(newWord.curry(r), (game.get(r).time * 60000) + 2000);

			// Clear canvas data
			game.canvas(socket.room, 0);

			// Pick next person in queue
			var currentPlayer = game.getPlayerDrawing(r),
				nextPlayer = game.nextPlayer(r),
				word = w || game.getWord(r);

			// Game over
			if (game.roundsLeft(r) <= 0) {
				clearTimeout(timer[r]);
				io.sockets.in(r).emit('game-over', game.playersNameAndScore(r));
				io.sockets.in(r).emit('correct-word', {
					word: word,
					player: currentPlayer && currentPlayer.getAllData(),
					next: { draw: false, player: nextPlayer.getAllData(), minutes: 0 }
				});
				return;
			}

			// Cancel if game is empty
			if (typeof nextPlayer === 'undefined') {
				clearTimeout(timer[r]);
				return;
			}

			// Check if there is just one player
			if (game.players(r).length === 1) {
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
				player: currentPlayer && currentPlayer.getAllData(),
				next: {
					draw: true,
					word: game.randomWord(r),
					player: nextPlayer.getAllData(),
					minutes: game.get(r).time
				}
			});

			// Tell all players that correct word is guessed and send word to next person
			io.sockets.in(r).except(nextPlayer.getSocketID()).emit('correct-word', {
				word: word,
				player: currentPlayer && currentPlayer.getAllData(),
				next: {
					draw: false,
					player: nextPlayer.getAllData(),
					minutes: game.get(r).time
				}
			});
		}, deleteGame = function (r) {
			var deleted = game.delete(r);

			io.sockets.in('lobby').emit('remove-room', deleted.id);

			// Create new game if needed
			if (game.nrOfSameType(deleted.type) === 0) {
				io.sockets.in('lobby').emit('add-room', game.getData(game.create(deleted.type)));
			}
		};


		// Join a game
		socket.on('join-room', function (room) {
			try {
				// Add player to room
				game.addPlayer(socket.player, room);

				// Leave the current room (stored in session)
				socket.leave(socket.room);
				game.removePlayer(socket.player, socket.room);

				// Send message to old room
				socket.broadcast.to(socket.room).emit('server-message', {
					text: socket.player.getName() + ' har lämnat spelet.'
				});

				// Join new room
				socket.join(room);
				socket.room = room;

				// Echo to the game that a player has connected to their game
				socket.broadcast.to(room).emit('player-joined-room', { player: socket.player.getAllData() });

				// Tell browser it worked
				socket.emit('join-room', { players: game.players(socket.room) });

				// Start game if its the second player
				if (game.players(socket.room).length === 2) {
					newWord(socket.room, '');
				} else if (game.players(socket.room).length === 1) {
					socket.emit('server-message', { text: 'Du är just nu ensam i detta spelet. Vänta en stund så kommer det förhoppningsvis fler spelare.' });
				} else {
					socket.emit('correct-word', {
						word: '',
						next: { draw: false, player: game.get(socket.room).drawing, minutes: 0 }
					});
				}

				// Send the canvas to the player
				socket.emit('canvas', game.canvas(socket.room));

				// Create new game if this is almost full
				if (game.nrOfSameType(game.get(socket.room).type) === 0) {
					var nrid = game.create(game.get(socket.room).type);
					io.sockets.in('lobby').emit('add-room', game.getData(nrid));
				}

				// Remove game from front page if full
				if (!game.notFull(socket.room)) {
					io.sockets.in('lobby').emit('remove-room', socket.room);
				}
			} catch (e) {
				socket.emit('error-message', { name: e.name, message: e.message });
			}
		});

		// Player disconnect
		socket.on('disconnect', function () {
			try {
				if (socket.room !== 'lobby') {
					var nrOfPlayers = game.removePlayer(socket.player, socket.room);
					// New word if this player is drawing
					if (game.playersTurn(socket.player, socket.room)) { newWord(socket.room); }
					// Tell clients to remove player
					socket.broadcast.to(socket.room).emit('leave-room', { name: socket.player.getName(), id: socket.player.getSocketID() });
					// Remove game if no players left
					if (nrOfPlayers === 0) { deleteGame(socket.room); }
				}
			} catch (e) {
				console.log('DISCONNECT ERROR: ' + e);
			}
		});

		socket.on('update-player-data', function (data) {
			socket.broadcast.to(socket.room).emit('server-message', { text: data.name + ' har bytt namn.' });
		});

		// Get drawing-points from player, and send to the others
		socket.on('canvas', function (data) {
			if (game.playersTurn(socket.player, socket.room)) {
				socket.broadcast.to(socket.room).emit('canvas', game.canvas(socket.room, data));
			}
		});

		// Player sends message
		socket.on('user-message', function (data) {
			if (data.isBlank() || game.playersTurn(socket.player, socket.room)) { return; }

			// Is the guess correct?
			var word = data.compact(),
				correct = word.toLowerCase() === (game.getWord(socket.room) || 'korrekt').toLowerCase(),
				p,
				d,
				r;

			// Send the message to all player in room
			io.sockets.in(socket.room).emit('user-message', {
				text: word,
				player: socket.player.getAllData(),
				win: correct
			});

			// Let next person draw
			if (correct) {
				r = game.get(socket.room);

				// Points to the player who guessed right
				p = r.players[socket.player.getSocketID()];
				p.skitpoints(dictionaries['general-easy'].points.max);

				// Points to the player who drawed
				d = r.players[r.queue[r.queue.length - 1]];
				d.skitpoints(dictionaries['general-easy'].points.max / 4);

				// Send to clients
				io.sockets.in(socket.room).emit('update-points', {
					guess_player: p.getAllData(),
					guess_points: dictionaries['general-easy'].points.max,
					guess_total: p.points(),
					draw_player: d.getAllData(),
					draw_points: dictionaries['general-easy'].points.max / 4,
					draw_total: d.points()
				});

				// Continue...
				newWord(socket.room);
			}
		});

		// Save image to server
		socket.on('save-image', function (data) {
			// TODO Check if it really was players turn to draw
			if (!game.playersTurn(socket.player, socket.room)) { return; }

			// Check if there is a image
			if (data === '') { return; }

			// Strip off the url prefix to get just the base64-encoded bytes
			var image = data.replace(/^data:image\/\w+;base64,/, ''),
				path = 'public/images/',
				filename = socket.id + Date.now() + '.png';

			// Save image
			fs.writeFile(path + filename, image, 'base64', function (err) {
				if (err) {
					console.log(err);
				} else {
					// Save image for room
					game.saveImage(socket.room, filename, function (err, data) {
						console.log(data);
					});
				}
			});
		});
	});

	return io;
};
