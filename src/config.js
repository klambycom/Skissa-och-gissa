var path = require('path');
var morgan = require('morgan');

module.exports = {
  all: function (app) {
    app.locals.page_title = 'Skissa och gissa';
    app.locals.page_description = 'Lorem ipsum';

    app.set('views', path.normalize(path.join(__dirname + '/components'))); // Why does this not work?
    app.set('view engine', 'js');
    app.set('view', require('react-engine/lib/expressView'));

    app.set('public folder', 'public');

    app.set('session secret', process.env.SESSION_SECRET);
    app.set('cookie secret', process.env.COOKIE_SECRET);
  },

  development: function (app) {
    app.set('ipaddr', 'localhost');
    app.set('port', 3000);
    app.set('db', 'mongodb://localhost/skissa-och-gissa');

    app.use(morgan('dev'));

    /*
    app.use(function (req, res, next) {
      // Print information about request to console
      console.log('%s %s', req.method, req.url);
      next();
    });
    */
  },

  production: function (app) {
    app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP);
    app.set('port', process.env.OPENSHIFT_NODEJS_PORT);

    app.use(morgan('combined', {
      skip: function (req, res) { return res.statusCode < 400; }
    }));

    // OpenShift MongoDB
    var connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
      process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
      process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
      process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
      process.env.OPENSHIFT_APP_NAME;
    app.set('db', connection_string);
  },

  facebook: function () {
    var ip = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
    var port = process.env.OPENSHIFT_NODEJS_PORT || '3000';

    return {
      appID: process.env.FACEBOOK_CLIENTID,
      appSecret: process.env.FACEBOOK_CLIENTSECRET,
      callbackUrl: 'http://' + ip + ':' + port + '/login/facebook/callback'
    };
  },

  twitter: function () {
    var ip = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
    var port = process.env.OPENSHIFT_NODEJS_PORT || '3000';

    return {
      consumerKey: process.env.TWITTER_CONSUMERKEY,
      consumerSecret: process.env.TWITTER_CONSUMERSECRET,
      callbackUrl: 'http://' + ip + ':' + port + '/login/twitter/callback'
    };
  }
};
