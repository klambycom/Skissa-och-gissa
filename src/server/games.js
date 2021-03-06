/**
 * # Games
 *
 * Handle games, and let users join and leave games.
 *
 * @module games
 */

/*!  */

var EventEmitter = require('events').EventEmitter;
var events = new EventEmitter();
var uuid = require('uuid');
var dict = require('../dictionary.json');
var rooms = {};

/*!
 * Room
 */

var Room = function (id) {
  this.id = id;
  this.players = {};
  this.queue = [];
  this.type = 'lobby';
  this.canvasPoints = [];
};

Room.prototype.clearPoints = function () {
  this.canvasPoints = [];
};

Room.prototype.addPoint = function (point) {
  this.canvasPoints.push(point);
};

Room.prototype.add = function (player) {
  this.players[player.uuid] = player;
  this.queue.push(player.uuid);
};

Room.prototype.remove = function (player) {
  delete this.players[player.uuid];
  this.queue = this.queue.filter(function (x) { return x !== player.uuid; });
};

Room.prototype.isFull = function () {
  return Object.keys(this.players).length >= this.maxPlayers;
};

Room.prototype.setRules = function (rules) {
  this.time = rules.time;
  this.rounds = rules.rounds;
  this.maxPlayers = rules.maxPlayers;
  this.points = rules.points; // max, one_line, many_lines
  this.words = rules.words;
};

Room.prototype.rndWord = function () {
  var index = Math.floor(Math.random() * this.words.length);
  this.word = this.words[index];
  this.words.splice(index, 1);
};

// TODO Return players that are friends with the player
Room.prototype.toJSON = function () {
  // Create array containing all players in the room
  var players = Object
    .keys(this.players)
    .map(function (x) { return this.players[x]; }.bind(this))
    .map(function (x) { return x.json(); });

  return {
    uuid: this.id,
    type: this.type,
    name: dict[this.type].name,
    description: dict[this.type].description,
    time: this.time,
    rounds: this.rounds,
    nrOfPlayers: Object.keys(this.players).length,
    maxPlayers: this.maxPlayers,
    points: this.points,
    difficulty: dict[this.type].difficulty,
    players: players
  };
};

Room.create = function (type) {
  // Create room
  var _uuid = uuid.v4();
  var room = new Room(_uuid);

  // Set the rules
  room.type = type;
  room.setRules(dict[type]);

  // Randomize word
  room.rndWord();

  // Save room
  rooms[_uuid] = room;

  return room;
};

// Create rooms from dict
rooms.lobby = new Room('lobby');
Object.keys(dict).forEach(Room.create);

/*!
 * Player
 */

// TODO Save Facebook information!
var Player = function (websocket) {
  this.websocket = websocket;
  this.uuid = uuid.v4();

  // Information from Facebook
  this.name = 'Anonymous';
  this.fbId = 'kj2l34jl3j';

  this.join('lobby');
};

Player.prototype.join = function (roomId) {
  // Leave the old room
  if (this.room) { rooms[this.room.id].remove(this); }

  // Join the new room
  this.room = rooms[roomId];
  this.room.add(this);
};

Player.prototype.json = function () {
  return { UUID: this.uuid, name: this.name, fbId: this.fbId, points: 0 };
};

Player.prototype.disconnect = function () {
  rooms[this.room.id].remove(this);
};

/*!  */

module.exports = {

  /**
   * Get all games as JSON, or just one room
   *
   * @function json
   * @param {string} roomId Optional room id
   * @returns {array} an array with the JSON of each room
   */

  json: function (roomId) {
    if (typeof roomId !== 'undefined') {
      return rooms[roomId].toJSON();
    }

    return Object
      .keys(rooms)
      // Create array from the rooms-object
      .map(function (x) { return rooms[x]; })
      // Filter out lobby
      .filter(function (x) { return x.id !== 'lobby'; })
      // Create JSON for each room
      .map(function (game) { return game.toJSON(); });
  },

  /**
   * Create new player and join lobby
   *
   * @function createPlayer
   * @returns {Player} the created player
   *
   * @fires player_added
   */

  createPlayer: function (websocket) {
    var player = new Player(websocket)
    events.emit('player_added', { player: player, room: player.room });

    return player;
  },

  /**
   * Join a room and leave the old room
   *
   * @function join
   * @param {Player} player - The player
   * @param {string} roomId - ID of the new room
   *
   * @fires player_added
   * @fires player_removed
   */

  join: function (player, roomId) {
    var oldRoom = player.room;
    player.join(roomId);
    events.emit('player_added', { player: player, room: player.room });
    events.emit('player_removed', { player: player, room: oldRoom });
  },

  /**
   * Leave room (and disconnect)
   *
   * @function leave
   * @param {Player} player - The player
   *
   * @fires player_removed
   */

  leave: function (player) {
    events.emit('player_removed', { player: player, room: player.room });
    player.disconnect();
  },

  /**
   * All players in a specific room
   *
   * @function players
   * @param {string} roomId - ID of the room
   *
   * @returns {array} all players in the room
   */

  players: function (roomId) {
    return Object
      .keys(rooms[roomId].players)
      .map(function (x) { return rooms[roomId].players[x]; });
  },

  /**
   * Get room with roomId, or throw an error.
   *
   * @function get
   * @param {string} roomId - ID of the room
   *
   * @throws Will throw an error if the room is not found
   *
   * @returns {Room} the room
   */

  get: function (roomId) {
    if (!rooms[roomId]) { throw 'Room not found'; }
    return rooms[roomId];
  },

  /**
   * Fired when room is created or removed, when player is added or removed
   * from room and when new image for a room is created
   *
   * @function addListener
   * @param {string} event
   * @param {function} listener
   *
   * @event room_created
   * @event room_removed
   * @event player_added
   * @event player_removed
   * @event new_room_image
   */

  addListener: function (event, listener) {
    if (['room_created', 'room_removed', 'player_added', 'player_removed', 'new_room_image']
        .indexOf(event) < 0) { throw 'Invalid event'; }

    return events.on(event, listener);
  },

  /**
   * Check if room is found and valid. And check if room is not full!
   *
   * @function isValidRoom
   * @param {string} roomId
   *
   * @return true if room is found and valid
   */

  canJoinRoom: function (roomId) {
    return typeof rooms[roomId] !== 'undefined' && !rooms[roomId].isFull();
  },

  /**
   * @function guess
   */

  guess: function (roomId, word) {
    if (rooms[roomId].word === word) {
      // Move player to the back of the queue
      var player = rooms[roomId].queue.shift();
      rooms[roomId].queue.push(player);
      // Get new random word
      rooms[roomId].rndWord();
      // Clear canvas
      rooms[roomId].clearPoints();

      return true;
    }

    return false;
  },

  /**
   * @function word
   */

  word: function (roomId) {
    return rooms[roomId].word;
  },

  /**
   * @function player
   */

  player: function (roomId, json) {
    if (json || typeof json === 'undefined') {
      return rooms[roomId].players[rooms[roomId].queue[0]].json();
    }

    return rooms[roomId].players[rooms[roomId].queue[0]];
  }
};
