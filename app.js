/*jslint node: true */
'use strict';

var express = require('express'),
	app = express(),
	controllers = require('./controllers').controllers,
	server;

// Controllers or routes
controllers.forEach(function (c) { app[c.verb](c.route, c.fn); });

// Start server
server = app.listen(3000);
console.log('Listening on port %d in %s mode...', 3000, app.get('env'));
