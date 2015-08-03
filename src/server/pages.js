var pages = require('express')();

pages.get('/', function (req, res) {
  //res.send('Pages root');
  res.render('index');
});

module.exports = pages;
