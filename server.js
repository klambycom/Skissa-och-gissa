require('node-jsx').install();

var path = require('path');
// Server
var http = require('http');
var app = require('express')();
var config = require('./src/config');
var ReactEngine = require('react-engine');
// DB
var mongoose = require('mongoose');
// Sub-apps
var api = require('./src/server/api');
var pages = require('./src/server/pages');
// Game-logic
// TODO Move!
var game = require('./lib/server/game').game;
var dict = require('./src/dictionary.json');
// Passport
var passport = require('passport');
// Middlewares
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// View engine
var routes = path.normalize(path.join(__dirname + '/src/routes.js'));
var engine = ReactEngine.server.create({ routes: require(routes), routesFilePath: routes });
app.engine('.js', engine);

// Configure
if (app.get('env') === 'development') { config.development(app); }
if (app.get('env') === 'production') { config.production(app); }
config.all(app);

// Middlewares
app.use(express['static'](app.get('public folder')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cookieParser(app.get('cookie secret')));
app.use(expressSession({ secret: app.get('session secret') }));
app.use(flash());

// MongoDB
mongoose.connect(app.get('db'));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Create some games
game.create(Object.keys(dict));

// Save rooms to every page load
app.use(function (req, res, next) {
  req.rooms = game.all();
  next();
});

// Mount sub-apps
app.use('/', pages);
app.use('/api', api);

// Create server
var server = http.createServer(app);

// WebSocket
require('./src/server/websockets').listen(server, game);

// Start server
server.listen(app.get('port'), app.get('ipaddr'));
console.log(
    'Listening on port %s:%d in %s mode...',
    app.get('ipaddr'),
    app.get('port'),
    app.get('env'));
