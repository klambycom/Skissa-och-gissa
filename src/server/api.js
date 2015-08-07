var api = require('express').Router();

api.get('/', function (req, res) {
  res.send('API root');
});

// TODO Change to post
api.get('/logout', function (req, res) {
  req.logout();
  res.status(204).send();
});

module.exports = api;
