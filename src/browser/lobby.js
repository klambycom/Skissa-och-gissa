var Reflux = require('reflux');
var socket = require('./websocket');

var actions = Reflux.createActions([
    'flash', // Flash-messages
    'alert' // PopUp-dialog
]);

var store = Reflux.createStore({
  listenables: actions,

  init() {
    socket.on('invalid room', this.invalidRoom);
  },

  invalidRoom(data) {
    // TODO Check if room is full or not found.
    // TODO Join room again when connecting after disconnect
    if (typeof data === 'undefined') {
      console.log('Game 404');
    } else {
      console.log('Game probebly full');
    }
  },

  onFlash(message) {
    this.trigger({ event: 'flash', type: '', data: message });
  },

  onAlert(message, title = 'Hej!', extra = '', closeable = true) {
    this.trigger({
      event: 'alert',
      type: '',
      data: { message, title, extra, closeable }
    });
  }
});

module.exports = actions;
module.exports.store = store;
