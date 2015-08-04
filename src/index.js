var Client = require('react-engine/lib/client');

require('./react/index.js');
require('./react/layout.js');

var options = {
  viewResolver: function (viewName) {
    return require('./react/' + viewName);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  Client.boot(options);
});
