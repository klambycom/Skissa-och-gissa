var pages = require('express')();

pages.get('/', function (req, res) {
  res.render('index', { title: 'test' });
});

pages.get('/game', function (req, res) {
  res.render('room', { title: 'test' });
});

module.exports = pages;
