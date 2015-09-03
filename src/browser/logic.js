var Reflux = require('reflux');
var socket = require('./websocket');

// TODO MOVE TO TESTS!!!
if (process && !process.browser) {
  window = {};
  window.localStorage = { getItem: function () {}, setItem: function () {} };
}

var actions = Reflux.createActions([
    'join', // Joining a game/room
    'chat',  // New chat-message
    'selectCrayon' // Player select new crayon color and size
]);

var store = Reflux.createStore({
  listenables: actions,

  init: function () {
    this.crayon = {
      color: window.localStorage.getItem('crayonColor') || 'red',
      size: +window.localStorage.getItem('crayonSize') || 5
    };

    this.ready = false;

    socket.on('connect', this._connect);
    socket.on('player', this._player);
    socket.on('join', this._join);
    socket.on('disconnect', this._disconnect);
    socket.on('error', function (err) { console.log('Socket.io-client ERROR: ', err); });

    socket.on('player joined', this._playerJoined);
    socket.on('player left', this._playerLeft);
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
    this.room = data.data;
    this.trigger({ event: 'join', type: 'game', data: data.data });
  },

  _playerJoined: function (data) {
    this.trigger({ event: 'otherPlayer', type: 'joined', data: data });
  },

  _playerLeft: function (data) {
    this.trigger({ event: 'otherPlayer', type: 'left', data: data.player });
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
  },

  onSelectCrayon: function (crayon) {
    if (crayon.color) {
      this.crayon.color = crayon.color;
      window.localStorage.setItem('crayonColor', crayon.color);
    }

    if (crayon.size) {
      this.crayon.size = crayon.size;
      window.localStorage.setItem('crayonSize', crayon.size);
    }
  }
});

module.exports = { actions: actions, store: store };
