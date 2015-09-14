var Reflux = require('reflux');
var socket = require('./websocket');

// TODO MOVE TO TESTS!!!
if (process && !process.browser) {
  window = {};
  window.localStorage = { getItem: function () {}, setItem: function () {} };
}

var actions = Reflux.createActions({
    'join': {}, // Joining a game/room
    'chat': {},  // New chat-message
    'canvas': { children: [ 'crayon', 'point', 'clear' ] }
});

var store = Reflux.createStore({
  listenables: actions,

  init: function () {
    // Init canvas
    this.crayon = {
      color: window.localStorage.getItem('crayonColor') || 'red',
      size: +window.localStorage.getItem('crayonSize') || 5
    };
    this.points = [];
    socket.on('canvas', this._pointFromServer);
    socket.on('your turn', this._yourRound);
    socket.on('new round', this._newRound);

    // Init websocket
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
    this._pointsFromServer(data.points);
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

    this.trigger({ event: 'crayon', type: 'update', data: this.crayon });
  },

  /*!
   * CANVAS
   */

  _addPoint: function (x, y, dragging, size, color) {
    if (typeof size === 'undefined') { size = this.crayon.size; }
    if (typeof color === 'undefined') { color = this.crayon.color; }

    var p = { x: x, y: y, color: color, size: size, dragging: !!dragging };
    this.points.push(p);

    this._triggerCanvas('point', {
      nrOfPoints: this.points.length,
      last: this._lastPoint
    });

    return p;
  },

  _getPrevAndCurrPoints: function (i) {
    return [ this.points[i - 1], this.points[i] ];
  },

  _lastPoint: function (fn) {
    fn.apply(null, this._getPrevAndCurrPoints(this.points.length - 1));
  },

  _eachPoint: function (fn) {
    for (var i = 0; i < this.points.length; i += 1) {
      fn.apply(null, this._getPrevAndCurrPoints(i));
    }
  },

  _pointFromServer: function (point) {
    this._addPoint(point.x, point.y, point.dragging, point.size, point.color);
  },

  _pointsFromServer: function (points) {
    points.forEach(this._pointFromServer);
  },

  _triggerCanvas: function (type, data) {
    this.trigger({ event: 'canvas', type: type, data: data });
  },

  onCanvas: function () {
  },

  onCanvasCrayon: function (crayon) {
    if (crayon.color) {
      this.crayon.color = crayon.color;
      window.localStorage.setItem('crayonColor', crayon.color);
    }

    if (crayon.size) {
      this.crayon.size = crayon.size;
      window.localStorage.setItem('crayonSize', crayon.size);
    }

    this._triggerCanvas('crayon', this.crayon);
  },

  onCanvasPoint: function (x, y, dragging) {
    socket.emit('canvas', this._addPoint(x, y, dragging));
    //addArray: forEach.bind(null, add),
  },

  onCanvasClear: function () {
    this.points = [];
    this._triggerCanvas('clear', []);
  },

  /*!
   * TURN
   */

  _yourRound: function (word) {
    console.log('Your turn:', word);
  },

  _newRound: function (player) {
    actions.canvas.clear();
    console.log('This players turn:', player);
  }
});

module.exports = { actions: actions, store: store };
