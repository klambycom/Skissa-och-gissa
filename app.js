/*jslint node: true */
'use strict';

var express = require('express'),
	app = express(),
	controllers = require('./controllers').controllers,
	config = require('./configure.json'),
	server;

// Configure
var set = function (obj) { Object.keys(obj).forEach(function (s) { app.set(s, obj[s]); }); };

// All environments
app.configure(function () {
	set(Object.keys(config).filter(function (c) { return c !== 'development' && c !== 'production'; }));
});

// Development only
app.configure('development', function () {
	set(config.development);
});

// Production only
app.configure('production', function () {
	set(config.production);
});

// Controllers or routes
controllers.forEach(function (c) { app[c.verb](c.route, c.fn); });

// Start server
server = app.listen(app.get('port'));
console.log('Listening on port %d in %s mode...', app.get('port'), app.get('env'));
