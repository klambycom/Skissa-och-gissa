require('node-jsx').install();

// Utils
var logger = require('./src/server/logger');
var path = require('path');
// Server
var http = require('http');
var express = require('express');
var app = express();
var config = require('./src/config');
var ReactEngine = require('react-engine');
// DB
var mongoose = require('mongoose');
// Sub-apps
var api = require('./src/server/api');
var pages = require('./src/server/pages');
// Passport
var passport = require('passport');
// Middlewares
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

// View engine
var routes = path.normalize(path.join(__dirname + '/src/routes.js'));
var engine = ReactEngine.server.create({ routes: require(routes), routesFilePath: routes });
app.engine('.js', engine);

// Configure
if (app.get('env') === 'development') { config.development(app); }
if (app.get('env') === 'production') { config.production(app); }
if (app.get('env') === 'test') { config.test(app); }
config.all(app);

// Middlewares
app.use(express['static'](app.get('public folder')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cookieParser(app.get('cookie secret')));
app.use(session({ secret: app.get('session secret'), resave: false, saveUninitialized: false }));
app.use(flash());

// MongoDB
mongoose.connect(app.get('db'));

// Passport
app.use(passport.initialize());
app.use(passport.session());
require('./src/passport/init');

// Mount sub-apps
app.use('/', pages);
app.use('/api', api);

app.use(function (req, res, next) {
  logger.error(
      'Page not found (%s)', req.url,
      { type: 'HTTP', meta: { status_code: 404, url: req.url } });

  res.status(404).render('404', { title: 'Sidan hittades ej', url: req.url });
});

// Create server
var server = http.createServer(app);

// WebSocket
require('./src/server/websockets')(server);

// Start server
if (app.get('env') !== 'test') {
  server.listen(app.get('port'), app.get('ipaddr'));

  logger.info(
      'Listening on port %s:%d in %s mode...',
      app.get('ipaddr'),
      app.get('port'),
      app.get('env'),
      {
        meta: {
          ipaddr: app.get('ipaddr'),
          port: app.get('port'),
          env: app.get('env')
        }
      });
}

module.exports = app;
