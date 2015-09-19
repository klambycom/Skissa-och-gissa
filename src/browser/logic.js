var Reflux = require('reflux');
var socket = require('./websocket');

// TODO MOVE TO TESTS!!!
if (typeof window === 'undefined') {
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

  init() {
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

  handleConnect() {
    this.ready = true;
    this.trigger({ event: 'connection', type: 'connected' });
  },

  handleDisconnect() {
    this.ready = false;
    this.trigger({ event: 'connection', type: 'disconnected' });
  },

  handlePlayer(data) {
    this.player = data;
    this.trigger({ event: 'player', type: 'update', data: data });
  },

  handleJoin(data) {
    this.room = data.data;
    this.trigger({ event: 'join', type: 'game', data: data.data });

    process.nextTick(function () {
      // Draw each point to the canvas
      data.points.forEach(this.handlePointFromServer);
    }.bind(this));
  },

  handlePlayerJoined(data) {
    this.trigger({ event: 'otherPlayer', type: 'joined', data });
  },

  handlePlayerLeft(data) {
    this.trigger({ event: 'otherPlayer', type: 'left', data: data.player });
  },

  handleChat(data) {
    data.me = typeof data.player === 'undefined';
    if (typeof data.player === 'undefined') { data.player = this.player; }
    this.trigger({ event: 'chat', type: 'message', data });
  },

  onJoin(roomId) {
    socket.emit('join', { roomId });
  },

  // TODO Should probably save the messages when offline, to send them when
  // connected to socket.io
  onChat(message) {
    // TODO Do i need to send uuid, or do the server know how is sending the
    // message?
    socket.emit('chat', { player: this.player, message });
    this.handleChat({ message });
  },

  onSelectCrayon(crayon) {
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

  _addPoint(x, y, dragging = false, size = this.crayon.size, color = this.crayon.color) {
    var p = { x, y, color, size, dragging };
    this.points.push(p);

    this._triggerCanvas('point', {
      nrOfPoints: this.points.length,
      last: this._lastPoint
    });

    return p;
  },

  _lastPoint(fn) {
    fn(this.points[this.points.length - 2], this.points[this.points.length - 1]);
  },

  _triggerCanvas(type, data) {
    this.trigger({ event: 'canvas', type, data });
  },

  handlePointFromServer(point) {
    this._addPoint(point.x, point.y, point.dragging, point.size, point.color);
  },

  handleYourRound(word) {
    console.log('Your turn:', word);
    this._triggerCanvas('start', word);
  },

  handleNewRound(player) {
    actions.canvas.clear(player);
    console.log('This players turn:', player);
  },

  onCanvasCrayon(crayon) {
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

  onCanvasPoint(x, y, dragging) {
    socket.emit('canvas', this._addPoint(x, y, dragging));
    //addArray: forEach.bind(null, add),
  },

  onCanvasClear(player) {
    this.points = [];
    this._triggerCanvas('clear', { playersTurn: player.UUID === this.player.UUID });
  }
});

module.exports = { actions: actions, store: store };
