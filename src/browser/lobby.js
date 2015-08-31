var Reflux = require('reflux');

var actions = Reflux.createActions([
    'flash' // Flash-messages
]);

var store = Reflux.createStore({
  listenables: actions,

  onFlash: function (message) {
    this.trigger({ event: 'flash', type: '', data: message });
  }
});

module.exports = actions;
module.exports.store = store;
