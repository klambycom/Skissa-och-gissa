var express = require('express');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

module.exports = {
  all: function (app) {
    app.set('title', 'Skissa och gissa');
    app.set('view engine', 'hbs');

    app.use(express['static'](app.get('public folder') || 'public'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(bodyParser.text());
    app.use(cookieParser(app.get('cookie secret')));
    app.use(flash());
  },

  development: function (app) {
    app.set('ipaddr', 'localhost');
    app.set('port', 3000);
    app.set('db', 'mongodb://localhost/skissa-och-gissa');

    app.use(function (req, res, next) {
      // Print information about request to console
      console.log('%s %s', req.method, req.url);
      next();
    });
  },

  production: function (app) {
    app.set('ipaddr', process.env.OPENSHIFT_NODEJS_IP);
    app.set('port', process.env.OPENSHIFT_NODEJS_PORT);

    // OpenShift MongoDB
    var connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
      process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
      process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
      process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
      process.env.OPENSHIFT_APP_NAME;
    app.set('db', connection_string);
  }
};
