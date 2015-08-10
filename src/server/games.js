/**
 * # Games
 *
 * Handle games, and let users join and leave games.
 *
 * @module games
 */

/*!  */

var uuid = require('uuid');
var dict = require('../dictionary.json');
var rooms = {};

/*!
 * Room
 */

var Room = function (id) {
  this.id = id;
  this.players = {};
  this.type = 'lobby';
};

Room.prototype.add = function (player) {
  this.players[player.uuid] = player;
};

Room.prototype.remove = function (player) {
  delete this.players[player.uuid];
};

Room.prototype.setRules = function (rules) {
  this.time = rules.time;
  this.rounds = rules.rounds;
  this.maxPlayers = rules.maxPlayers;
  this.points = rules.points; // max, one_line, many_lines
  this.words = rules.words;
};

Room.create = function (type) {
  // Create room
  var _uuid = uuid.v4();
  var room = new Room(_uuid);

  // Set the rules
  room.type = type;
  room.setRules(dict[type]);

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
  this.join('lobby');
};

Player.prototype.join = function (roomId) {
  // Leave the old room
  if (this.room) { rooms[this.room.id].remove(this); }

  // Join the new room
  this.room = rooms[roomId];
  this.room.add(this);
};

Player.prototype.disconnect = function () {
  rooms[this.room.id].remove(this);
};

/*!  */

module.exports = {

  /**
   * Create new player and join lobby
   *
   * @function createPlayer
   * @returns {Player} the created player
   */

  createPlayer: function (websocket) {
    return new Player(websocket);
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
    player.join(roomId);
  },

  /**
   * Leave room (and disconnect)
   *
   * @function leave
   * @param {Player} player - The player
   *
   * @fires player_added
   * @fires player_removed
   */

  leave: function (player) {
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
   * @function get
   *
   * @event room_created
   * @event room_removed
   * @event player_added
   * @event player_removed
   * @event new_room_image
   */

  on: function () {
  }
};
