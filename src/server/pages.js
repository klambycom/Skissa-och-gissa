var pages = require('express')();

pages.get('/', function (req, res) {
  res.send('Pages root');
});

module.exports = pages;
