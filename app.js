/*jslint node: true */
'use strict';

var express = require('express'),
	app = express(),
	controllers = require('./controllers').controllers,
	config = require('./configure.json'),
	server;

// Configure
var set = function (obj) { return function (s) { app.set(s, obj[s]); }; },
	setAll = function (obj) { Object.keys(obj).forEach(set(obj)); };

// All environments
app.configure(function () {
	Object.keys(config).filter(function (c) { return c !== 'development' && c !== 'production'; })
					   .forEach(set(config));
	app.use(express['static'](app.get('public folder') || 'public'));
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

// Controllers or routes
controllers.forEach(function (c) { app[c.verb](c.route, c.fn); });

// Start server
server = app.listen(app.get('port'));
console.log('Listening on port %d in %s mode...', app.get('port'), app.get('env'));
