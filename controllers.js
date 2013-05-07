/*jslint node: true */
'use strict';

exports.controllers = [];
var save = function (v) { return function (r, f) { exports.controllers.push({ verb: v, route: r, fn: f }); }; },
	app = { get: save('get'), post: save('post'), param: save('param') },
	room = require('./lib/server/room').room;

var fs = require('fs'),
	getDictionary = function (type) {
		// TODO Check if file is changed or save cache 5 minutes or something
		// TODO Should probebly use require and require.cache
		return JSON.parse(fs.readFileSync('./dictionary.json'))[type];
	};

app.get('/', function (req, res) {
	var r = room.all();

	res.render('index', {
		text: 'World',
		rooms: Object.keys(r).map(function (a) {
			var dict = getDictionary(r[a].type);
			return {
				id: r[a].id,
				type: r[a].type,
				name: dict.name,
				description: dict.description,
				difficulty: dict.difficulty
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
