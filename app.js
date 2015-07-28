/*jslint node: true */
'use strict';

require('./lib/utils/functional');

var express = require('express'),
	app = express(),
	controllers = require('./controllers').controllers,
	config = require('./configure.json'),
	flash = require('connect-flash'),
	server,
	game = require('./lib/server/game').game,
	mongoose = require('mongoose'),
	dict = require('./dictionary.json');

console.log(app.get('env'));

// Configure
var set = function (obj) { return function (s) { app.set(s, obj[s]); }; },
	setAll = function (obj) { Object.keys(obj).forEach(set(obj)); };

// Configure all environments
Object
  .keys(config)
  .filter(function (c) { return c !== 'development' && c !== 'production'; })
  .forEach(set(config));

app.use(express['static'](app.get('public folder') || 'public'));
app.use(express.bodyParser());
app.use(express.cookieParser(app.get('cookie secret')));
app.use(flash());

// Configure development only
if (app.get('env') === 'development') {
	setAll(config.development);

	app.use(function (req, res, next) {
    // Print information about request to console
		console.log('%s %s', req.method, req.url);
		next();
	});
}

// Configure production only
if (app.get('env') === 'production') { setAll(config.production); }

// MongoDB
mongoose.connect(app.get('db'));

// Create some games
game.create(Object.keys(dict));

// Save rooms to every page load
app.use(function (req, res, next) {
	req.rooms = game.all();
	next();
});

// Controllers or routes
controllers.forEach(function (c) { app[c.verb](c.route, c.fn); });

// Start server
server = app.listen(app.get('port'));
console.log('Listening on port %d in %s mode...', app.get('port'), app.get('env'));

// WebSocket
require('./websockets').listen(server, game);
