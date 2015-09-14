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
    socket.on('canvas', this.handlePointFromServer);
    socket.on('your turn', this.handleYourRound);
    socket.on('new round', this.handleNewRound);

    // Init websocket
    this.ready = false;

    socket.on('connect', this.handleConnect);
    socket.on('player', this.handlePlayer);
    socket.on('join', this.handleJoin);
    socket.on('disconnect', this.handleDisconnect);
    socket.on('error', function (err) { console.log('Socket.io-client ERROR: ', err); });

    socket.on('player joined', this.handlePlayerJoined);
    socket.on('player left', this.handlePlayerLeft);
    socket.on('chat', this.handleChat);
  },

  handleConnect: function () {
    this.ready = true;
    this.trigger({ event: 'connection', type: 'connected' });
  },

  handleDisconnect: function () {
    this.ready = false;
    this.trigger({ event: 'connection', type: 'disconnected' });
  },

  handlePlayer: function (data) {
    this.player = data;
    this.trigger({ event: 'player', type: 'update', data: data });
  },

  handleJoin: function (data) {
    this.room = data.data;
    this.trigger({ event: 'join', type: 'game', data: data.data });
    // Draw each point to the canvas
    data.points.forEach(this.handlePointFromServer);
  },

  handlePlayerJoined: function (data) {
    this.trigger({ event: 'otherPlayer', type: 'joined', data: data });
  },

  handlePlayerLeft: function (data) {
    this.trigger({ event: 'otherPlayer', type: 'left', data: data.player });
  },

  handleChat: function (data) {
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
    this.handleChat({ message: message });
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

  _lastPoint: function (fn) {
    fn(this.points[this.points.length - 2], this.points[this.points.length - 1]);
  },

  _triggerCanvas: function (type, data) {
    this.trigger({ event: 'canvas', type: type, data: data });
  },

  handlePointFromServer: function (point) {
    this._addPoint(point.x, point.y, point.dragging, point.size, point.color);
  },

  handleYourRound: function (word) {
    console.log('Your turn:', word);
    this._triggerCanvas('start', word);
  },

  handleNewRound: function (player) {
    actions.canvas.clear(player);
    console.log('This players turn:', player);
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

  onCanvasClear: function (player) {
    this.points = [];
    this._triggerCanvas('clear', { playersTurn: player.UUID === this.player.UUID });
  }
});

module.exports = { actions: actions, store: store };
