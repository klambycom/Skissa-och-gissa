var pages = require('express').Router();

pages.get('/', function (req, res) {
  res.render(req.url, { title: 'test' });
});

pages.get('/game', function (req, res) {
  res.render(req.url, { title: 'test' });
});

module.exports = pages;
