/*jslint node: true */
'use strict';

require('./lib/utils/functional');

var http = require('http'),
    app = require('express')(),
    controllers = require('./controllers').controllers,
    server,
    game = require('./lib/server/game').game,
    mongoose = require('mongoose'),
    dict = require('./dictionary.json'),
    config = require('./config');

// Configure
if (app.get('env') === 'development') { config.development(app); }
if (app.get('env') === 'production') { config.production(app); }
config.all(app);

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

// Create server
server = http.createServer(app);

// WebSocket
require('./websockets').listen(server, game);

// Start server
server.listen(app.get('port'), app.get('ipaddr'));
console.log(
    'Listening on port %s:%d in %s mode...',
    app.get('ipaddr'),
    app.get('port'),
    app.get('env'));
