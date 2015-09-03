var Reflux = require('reflux');
var socket = require('./websocket');

var actions = Reflux.createActions([
    'flash', // Flash-messages
    'alert' // PopUp-dialog
]);

var store = Reflux.createStore({
  listenables: actions,

  init: function () {
    socket.on('invalid room', this.invalidRoom);
  },

  invalidRoom: function (data) {
    // TODO Check if room is full or not found.
    // TODO Join room again when connecting after disconnect
    if (typeof data === 'undefined') {
      console.log('Game 404');
    } else {
      console.log('Game probebly full');
    }
  },

  onFlash: function (message) {
    this.trigger({ event: 'flash', type: '', data: message });
  },

  onAlert: function (message, title, extra, closeable) {
    if (typeof title === 'undefined' || title === null) { title = 'Hej!'; }
    if (typeof extra === 'undefined' || extra === null) { extra = ''; }
    if (typeof closeable === 'undefined' || closeable === null) { closeable = true; }

    this.trigger({
      event: 'alert',
      type: '',
      data: {
        message: message,
        title: title,
        extra: extra,
        closeable: closeable
      }
    });
  }
});

global._alert = function (message, title, extra) {
  actions.alert(message, title, extra);
};

module.exports = actions;
module.exports.store = store;
