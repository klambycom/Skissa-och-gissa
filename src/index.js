var Client = require('react-engine/lib/client');
var Routes = require('./routes');

require('./react/index.js');
require('./react/layout.js');
require('./react/room.js');

var options = {
  routes: Routes,
  viewResolver: function (viewName) {
    try {
      return require('./react/' + viewName);
    } catch (e) {
      console.log('The component ' + viewName + ' is not loaded in index.js');
    }
  }
};

document.addEventListener('DOMContentLoaded', function () {
  Client.boot(options);
});
