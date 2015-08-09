/**
 * # Games
 *
 * Handle games, and let users join and leave games.
 *
 * @module games
 */

/*!  */

var uuid = require('uuid');

var Room = function (id) {
  this.id = id;
};

var rooms = {
  lobby: new Room('lobby')
};

var Player = function (websocket) {
  this.websocket = websocket;
  this.uuid = uuid.v4();
  this.room = rooms.lobby;
};

/*!  */

module.exports = {

  /**
   * Create new player and join lobby
   *
   * @function createPlayer
   * @return {Player} the created player
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
  },

  /**
   * All players in a specific room
   *
   * @function players
   * @param {string} roomId - ID of the room
   */

  players: function (roomId) {
  },

  /**
   * All players in all rooms
   *
   * @function all
   */

  all: function () {
  },

  /**
   * Get room with roomId
   *
   * @function get
   * @param {string} roomId - ID of the room
   */

  get: function (roomId) {
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
