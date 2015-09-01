var api = require('express').Router();
var games = require('./games');
var logger = require('./logger');

api.get('/', function (req, res) {
  res.send('API root');
});

// TODO Change to post
api.get('/logout', function (req, res) {
  req.logout();
  res.status(204).send();
});

/*!
 * Games
 */

api.param('uuid', function (req, res, next, uuid) {
  try {
    req.game = games.get(uuid).toJSON();
    next();
  } catch (e) {
    res.status(404).send('Not found');
  }
});

api.get('/games/:uuid', function (req, res) {
  res.json(req.game);
});

api.get('/games', function (req, res) {
  res.json(games.json());
});

/*!
 * Admin
 */

api.get('/logs', function (req, res) {
  logger.read(function (err, entries) {
    res.json({
      nrOfEntries: {
        total: entries.all().length,
        debug: entries.ofType('debug').length,
        verbose: entries.ofType('verbose').length,
        info: entries.ofType('info').length,
        warn: entries.ofType('warn').length,
        error: entries.ofType('error').length
      },
      entries: entries.all()
    });
  });
});

module.exports = api;
