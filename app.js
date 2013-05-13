/*jslint node: true */
'use strict';

require('./lib/utils/functional');

var express = require('express'),
	app = express(),
	controllers = require('./controllers').controllers,
	config = require('./configure.json'),
	flash = require('connect-flash'),
	server,
	room = require('./lib/server/room').room;

// Configure
var set = function (obj) { return function (s) { app.set(s, obj[s]); }; },
	setAll = function (obj) { Object.keys(obj).forEach(set(obj)); };

// All environments
app.configure(function () {
	Object.keys(config).filter(function (c) { return c !== 'development' && c !== 'production'; })
					   .forEach(set(config));

	app.use(express['static'](app.get('public folder') || 'public'));
	app.use(express.bodyParser());
	app.use(express.cookieParser(app.get('cookie secret')));
	app.use(flash());
});

// Development only
app.configure('development', function () {
	setAll(config.development);

	app.use(function (req, res, next) {
		console.log('%s %s', req.method, req.url);
		next();
	});
});

// Production only
app.configure('production', function () {
	setAll(config.production);
});

// Create some rooms
room.create(['general-easy', 'general-moderate', 'general-hard']);

//var Player = require('./lib/server/Player').Player,
//	player1 = new Player({
//		name: 'Christian Nilsson',
//		socket: 'christian-s',
//		id: 'christian-i',
//		picture: { data: { url: 'christian' } }
//	}),
//	player2 = new Player({
//		name: 'Iver Nilsson',
//		socket: 'ivar-s',
//		id: 'ivar-i',
//		picture: { data: { url: 'ivar' } }
//	}),
//	player3 = new Player({
//		name: 'Johanna Nilsson',
//		socket: 'johanna-s',
//		id: 'johanna-i',
//		picture: { data: { url: 'johanna' } }
//	}),
//	r = Object.keys(room.all())[0],
//	r2 = Object.keys(room.all())[1],
//	addToFirstRoom = room.addPlayer.flip().curry(r),
//	rData = room.get(r);
//room.addPlayer(player1, r);
//room.addPlayer(player2, r);
//addToFirstRoom(player3);
//
//console.log(room.all());
//console.log('----------');
//room.removePlayer(player2, r);
//console.log(room.all());
//console.log('----------');
//room.addPlayer(player2, r2);
//console.log(room.all());
//console.log('----------');
//room.change(player2, r2, r);
//console.log(room.all());
//
//var currying = require('./lib/utils/currying'),
//	playerIsNext = currying(room.playerIsNext, player1),
//	isPlayerNext = currying(room.playerIsNext, player1, r);
//
//console.log('========');
//console.log(playerIsNext(r));
//console.log(playerIsNext(r));
//console.log(playerIsNext(r));
//console.log(playerIsNext(r));
//console.log(playerIsNext(r));
//console.log(isPlayerNext());
//console.log(room.nextPlayer(r).getSocketID());
//console.log('========');

// Save rooms to every page load
app.use(function (req, res, next) {
	req.rooms = room.all();
	next();
});

// Controllers or routes
controllers.forEach(function (c) { app[c.verb](c.route, c.fn); });

// Start server
server = app.listen(app.get('port'));
console.log('Listening on port %d in %s mode...', app.get('port'), app.get('env'));

// WebSocket
require('./websockets').listen(server, room);
