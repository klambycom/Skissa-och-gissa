var pages = require('express')();

pages.get('/', function (req, res) {
  res.render('index', { title: 'test' });
});

module.exports = pages;
