var Reflux = require('reflux');
// TODO Remove later. And mock socket another way. For tests!
var socket = { on: function () {}, emit: function () {} };
if (process && process.browser) {
  socket = require('socket.io-client')('http://localhost:3000');
}

var actions = Reflux.createActions([
    'join', // Joining a game/room
    'chat'  // New chat-message
]);

var store = Reflux.createStore({
  listenables: actions,

  init: function () {
    this.ready = false;
    socket.on('connect', this._connect);
    socket.on('player', this._player);
    socket.on('join', this._join);
    socket.on('disconnect', this._disconnect);
    socket.on('error', function (err) { console.log('Socket.io-client ERROR: ', err); });

    socket.on('player joined', this._newPlayer);
    socket.on('chat', this._chat);
  },

  _connect: function () {
    this.ready = true;
    this.trigger({ event: 'connection', type: 'connected' });
  },

  _disconnect: function () {
    this.ready = false;
    this.trigger({ event: 'connection', type: 'disconnected' });
  },

  _player: function (data) {
    this.player = data;
    this.trigger({ event: 'player', type: 'update', data: data });
  },

  _join: function (data) {
    this.room = data;
    this.trigger({ event: 'join', type: 'game', data: data.data });
  },

  _newPlayer: function (data) {
    this.trigger({ event: 'chat', type: 'new-player', data: data });
  },

  _chat: function (data) {
    data.me = typeof data.player === 'undefined';
    if (typeof data.player === 'undefined') { data.player = this.player; }
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
    socket.emit('chat', { player: this.player, message: message });
    this._chat({ message: message });
  }
});

module.exports = { actions: actions, store: store };
