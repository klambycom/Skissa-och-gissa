var Reflux = require('reflux');
var socket = require('socket.io-client')('http://localhost:3000');

var actions = Reflux.createActions([
    'join', // Joining a game/room
    'chat'  // New chat-message
]);

var store = Reflux.createStore({
  listenables: actions,

  init: function () {
    this.ready = false;
    socket.on('connect', this._connect);
    socket.on('disconnect', this._disconnect);

    socket.on('player-joined', this._newPlayer);
    socket.on('message', this._message);
  },

  _connect: function () {
    this.ready = true;
    console.log('connected');
    this.trigger({ event: 'connection', type: 'connected' });
  },

  _disconnect: function () {
    this.ready = false;
    console.log('disconnected');
    this.trigger({ event: 'connection', type: 'disconnected' });
  },

  _newPlayer: function (data) {
    this.trigger({ event: 'chat', type: 'new-player', data: data });
  },

  _message: function (data) {
    this.trigger({ event: 'chat', type: 'message', data: data });
  },

  onJoin: function (roomId) {
    socket.emit('join', { roomId: roomId });
  },

  // TODO Should probably save the messages when offline, to send them when
  // connected to socket.io
  onChat: function (message) {
    // TODO Do i need to send uuid, or do the server know how is sending the
    // message?
    if (typeof this.player !== 'undefined') {
      socket.emit('message', { uuid: this.player.uuid, message: message });
    }
  }
});

module.exports = { actions: actions, store: store };
