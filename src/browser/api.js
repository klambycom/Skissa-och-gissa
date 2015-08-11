var restful = require('restful.js');

var api = restful('localhost').prefixUrl('api').port(3000);

module.exports = {
  games: api.all('games')
};
