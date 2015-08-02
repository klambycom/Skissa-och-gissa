var api = require('express')();

api.get('/', function (req, res) {
  res.send('API root');
});

module.exports = api;
