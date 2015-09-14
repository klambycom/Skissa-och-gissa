var Client = require('react-engine/lib/client');
var Routes = require('./routes');

require('./components/pages/settings'); // TODO Needed?
require('./components/game/index'); // TODO Needed?
require('./components/404');

var options = {
  routes: Routes,
  viewResolver: function (viewName) {
    try {
      return require('./components/' + viewName);
    } catch (e) {
      console.log('The component ' + viewName + ' is not loaded in index.js');
    }
  }
};

document.addEventListener('DOMContentLoaded', function () {
  Client.boot(options);
});
