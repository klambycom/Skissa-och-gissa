/*jslint node: true, es5: true */
'use strict';

/**
 * @namespace server
 * @class room
 * @static
 */

require('../utils/functional');

var sugar = require('sugar'),
	Player = require('./Player').Player,
	rooms = {},
	room = {},
	filter = function (fn) { return function (a) { return a.filter(fn); }; },
	saveOld = function (r) {
		var rr = rooms[r];
		rr.old = { player: rr.players[rr.drawing], word: rr.word };
	};

var ImageModel = require('../../models/Image.js');

var fs = require('fs'),
	getDictionary = function (type) {
		return JSON.parse(fs.readFileSync('./dictionary.json'))[type];
	};

/**
 * @method create
 * @param type {string|array} Type of room. Must be a valid name from
 *                            dictionary.json. Or an array of rooms.
 * @return Returns this. TODO Why?
 */
room.create = function (type) {
	var id = Number.random(99) + '-' + Date.now() + '-' + Number.random(99),
		name = (Array.isArray(type)) ? type.pop() : type;

	rooms[id] = {
		id: id,
		type: name,
		time: getDictionary(name).time,
		players: {},
		queue: [],
		word: '',
		words: getDictionary(name).words,
		canvas: [],
		drawing: undefined,
		image: 'placeholder.png',
		rounds: 0,
		maxPlayers: getDictionary(name).maxPlayers,
		totalRounds: getDictionary(name).rounds,
		old: {
			player: undefined,
			word: ''
		}
	};

	if (Array.isArray(type) && type.length > 0) { room.create(type); }

	return id;
};

room.delete = function (r) {
	var deleted = rooms[r];
	delete rooms[r];
	return deleted;
};

room.roundsLeft = function (r) { return rooms[r].totalRounds - rooms[r].rounds; };

room.notFull = function (r) { return Object.size(rooms[r].players) < rooms[r].maxPlayers; };

room.getDataForClient = function (r) {
	return {
		id: rooms[r].id,
		type: rooms[r].type,
		image: rooms[r].image,
		players: Object.keys(rooms[r].players).map(function (p) {
			return {
				name: rooms[r].players[p].getName(),
				picture: rooms[r].players[p].getPicture(),
				facebook: rooms[r].players[p].getFacebookID()
			};
		}),
		nrOfPlayers: Object.keys(rooms[r].players).length,
		roundsLeft: room.roundsLeft(r),
		description: getDictionary(rooms[r].type).description,
		difficulty: getDictionary(rooms[r].type).difficulty,
		name: getDictionary(rooms[r].type).name
	};
};

room.withMoreRounds = filter(function (r) { return room.roundsLeft(r) > 2; });

room.withEmptySpots = filter(room.notFull);

room.withMoreRoundsAndEmptySpots = room.withMoreRounds.composite(room.withEmptySpots);

//var filterNotDone = filter(function (r) { return rooms[r].totalRounds - rooms[r].rounds > 2; }),
//	filterNotFull = filter(function (r) { return Object.size(rooms[r].players) < rooms[r].maxPlayers; }),
//	allIds = Object.keys.curry(rooms),
//	available = filterNotDone.composite(filterNotFull, allIds).map.curry(room.getDataForClient);
//
//var games = { ... },
//
//	// Returnerar information om spel
//	getData = function (g) {
//		return { ... }
//	},
//
//	// Hitta spel med mer än ett par runder kvar
//	filterNotDone = filter(function (g) { return games[g].totalRounds - games[g].rounds > 2; }),
//
//	// Hitta spel som inte är fulla
//	filterNotFull = filter(function (g) { return games[g].players < games[g].maxPlayers; }),
//
//	// Alla tillgängliga spel
//	availableIds = filterNotDone.composite(filterNotFull, Object.keys),
//
//	// Information om alla tillgängliga spel
//	available = function () { return availableIds(games).map(getData); };
//
//var game = function (fn) { return function (g) { return fn(rooms[g]); }; },
//	filterNotDone = filter(game(function (g) { return g.totalRounds - g.rounds > 2; })),
//	filterNotFull = filter(game(function (g) { return Object.size(g.players) < g.maxPlayers; })),
//	allIds = Object.keys.curry(rooms),
//	available = filterNotDone.composite(filterNotFull, allIds).map.curry(room.getDataForClient);

room.available = function () {
	return room.withMoreRoundsAndEmptySpots(Object.keys(rooms)).map(room.getDataForClient);
};

room.saveImage = function (r, file, cb) {
	var rr = rooms[r];

	if (rr.old.player && rr.old.player.getFacebookID()) {
		new ImageModel({ player: rr.old.player.getFacebookID(), url: file, word: rr.old.word }).save(function (err, data) {
			data.player_name = rr.old.player.getFullName();
			data.player_pic = rr.old.player.getPicture();
			cb(err, data);
		});
	}

	rr.image = file;
};

room.canvas = function (r, p) {
	// Empty canvas
	if (p === 0) {
		rooms[r].canvas = [];
		return [];
	}
	
	// Return all points
	if (p === undefined) {
		return rooms[r].canvas;
	}

	// Add one point and return it
	rooms[r].canvas.push(p);
	return p;
};

room.nrOfSameType = function (type) {
	var find = function (i) { return rooms[i].type === type && Object.size(rooms[i].players) <= 7; };

	return Object.keys(rooms).filter(find).length;
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
 * @return Returns this. TODO Why?
 */
room.addPlayer = function (player, r) {
	// Get room data
	var data = rooms[r];
	// Throw error if room do not exists
	if (typeof data === 'undefined') {
		throw { name: 'GameNotFoundException', message: 'Can\'t add player since the game is not found.' };
	} else if (typeof player === 'undefined') {
		throw { name: 'PlayerNotFoundException', message: 'Can\'t add non-existing player to the game.' };
	} else if (Object.size(data.players) > 8) {
		throw { name: 'GameIsFullException', message: 'Can\'t add player since the game is full.' };
	}
	// Add player to room
	//data.players[player.getSocketID()] = {
	//	facebook: player.getFacebookID(),
	//	picture: player.getPicture(),
	//	name: player.getFullName()
	//};
	data.players[player.getSocketID()] = player;
	// Add player to queue
	data.queue.push(player.getSocketID());
	// Save
	rooms[r] = data;

	return this;
};

/**
 * @method players
 * @param roomId {string}
 * @return Return players in room.
 */
room.players = function (r) {
	if (typeof rooms[r] === 'undefined') {
		throw { name: 'GameNotFoundException', message: 'Can\'t get players since the game is not found.' };
	}

	return Object.keys(rooms[r].players).map(function (p) { return rooms[r].players[p].getAllData(); });
};

room.playersNameAndScore = function (r) {
	if (typeof rooms[r] === 'undefined') {
		throw { name: 'GameNotFoundException', message: 'Can\'t get players since the game is not found.' };
	}

	return Object.keys(rooms[r].players).map(function (p) {
		return {
			name: rooms[r].players[p].getName(),
			picture: rooms[r].players[p].getPicture(),
			score: rooms[r].players[p].points()
		};
	});
};

/**
 * @method removePlayer
 * @param player {Player}
 * @param roomId {string}
 * @return Returns number of players left in the game.
 */
room.removePlayer = function (player, r) {
	if (!(rooms[r] && rooms[r].players[player.getSocketID()])) { return 0; }

	// Remove player form room
	delete rooms[r].players[player.getSocketID()];
	// Remove player from queue
	rooms[r].queue.remove(player.getSocketID());

	return Object.size(rooms[r].players);
};

/**
 * @method change
 * @param player {Player}
 * @param fromRoomId {string}
 * @param toRoomId {string}
 */
room.change = function (player, from, to) {
	room.removePlayer(player, from);
	room.addPlayer(player, to);
};

/**
 * @method playerIsNext
 * @param player {Player}
 * @param roomId {string}
 * @return Returns true if its players turn to draw.
 */
room.playerIsNext = function (player, r) {
	saveOld(r);

	var data = rooms[r], // Get room data
		next = data.queue.shift(); // Get next player
	// Put player last
	data.queue.push(next);
	// Save
	rooms[r] = data;
	// Save drawing player
	rooms[r].drawing = next;
	// Remove undefined
	rooms[r].queue = rooms[r].queue.filter(function (p) { return p !== undefined; });

	rooms[r].rounds += 1;

	return next === player.getSocketID();
};

/**
 * @method nextPlayer
 * @param roomId {string}
 * @return Returns the next player in the queue.
 */
room.nextPlayer = function (r) {
	saveOld(r);

	var data = rooms[r], // Get room data
		next = data.queue.shift(); // Get next player
	// Put player last
	data.queue.push(next);
	// Save
	rooms[r] = data;
	// Save drawing player
	rooms[r].drawing = next;
	// Remove undefined
	rooms[r].queue = rooms[r].queue.filter(function (p) { return p !== undefined; });

	rooms[r].rounds += 1;

	return rooms[r].players[next];
};

room.getPlayerDrawing = function (r) {
	return rooms[r].players[rooms[r].drawing];
};

/**
 * @method playersTurn
 * @param player {Player}
 * @param roomId {string}
 * @return Returns true if its the players turn to draw.
 */
room.playersTurn = function (p, r) {
	return rooms[r].drawing === p.getSocketID();
};

/**
 * @method setWord
 * @param roomId {string}
 * @param word {string}
 * @return Returns the word.
 */
room.setWord = function (room, word) {
	rooms[room].word = word;
	return word;
};

/**
 * @method getWord
 * @param roomId {string}
 * @return Returns the word.
 */
room.getWord = function (room) {
	return rooms[room].word;
};

/**
 * @method randomWord
 * @param roomId {string}
 * @return Returns a random word.
 */
room.randomWord = function (r) {
	// A random word
	rooms[r].word = rooms[r].words.sample();
	// Remove word from words-array
	rooms[r].words = rooms[r].words.remove(rooms[r].word);

	return rooms[r].word;
};

exports.room = room;
