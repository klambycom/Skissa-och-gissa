var api = require('express').Router();
var games = require('./games');

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
  console.log(req);
  res.json(req.game);
});

api.get('/games', function (req, res) {
  res.json(games.json());
});

module.exports = api;
