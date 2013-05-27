/*jslint node: true */
'use strict';

exports.controllers = [];
var save = function (v) { return function (r, f) { exports.controllers.push({ verb: v, route: r, fn: f }); }; },
	app = { get: save('get'), post: save('post'), param: save('param') };

var fs = require('fs'),
	getDictionary = function (type) {
		// TODO Check if file is changed or save cache 5 minutes or something
		// TODO Should probebly use require and require.cache
		return JSON.parse(fs.readFileSync('./dictionary.json'))[type];
	};

app.get('/', function (req, res) {
	res.render('index', {
		text: 'World',
		rooms: Object.keys(req.rooms).map(function (a) {
			var room = req.rooms[a],
				dict = getDictionary(room.type),
				players = Object.keys(room.players).map(function (p) { return room.players[p].facebook; });
			return {
				id: req.rooms[a].id,
				type: req.rooms[a].type,
				name: dict.name,
				description: dict.description,
				difficulty: dict.difficulty,
				nrOfPlayers: players.length,
				image: req.rooms[a].image
			};
		})
	});
});

app.get('/room', function (req, res) {
	res.render('room', { text: 'World' });
});

app.get('/channel.html', function (req, res) {
	res.render('channel');
});
