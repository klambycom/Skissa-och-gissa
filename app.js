/*jslint node: true */
'use strict';

var express = require('express'),
	app = express(),
	controllers = require('./controllers').controllers,
	config = require('./configure.json'),
	server;

// All environments
app.configure(function () {
	Object.keys(config).filter(function (c) { return c !== 'development' && c !== 'production'; })
					   .forEach(function (c) { app.set(c, config[c]); });
});

// Development only
app.configure('development', function () {
	Object.keys(config.development).forEach(function (c) { app.set(c, config.development[c]); });
});

// Production only
app.configure('production', function () {
	Object.keys(config.production).forEach(function (c) { app.set(c, config.production[c]); });
});

// Controllers or routes
controllers.forEach(function (c) { app[c.verb](c.route, c.fn); });

// Start server
server = app.listen(app.get('port'));
console.log('Listening on port %d in %s mode...', app.get('port'), app.get('env'));
