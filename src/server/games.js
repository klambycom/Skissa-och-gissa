/**
 * # Games
 *
 * Handle games, and let users join and leave games.
 *
 * @module games
 */

/*!  */

module.exports = {

  /**
   * Join a room and leave the old room
   *
   * @function join
   * @param {string} playerId - ID of the player
   * @param {string} roomId - ID of the new room
   * @param {string} oldRoomId - ID of the old room
   *
   * @fires player_added
   * @fires player_removed
   */

  join: function (playerId, roomId, oldRoomId) {
  },

  /**
   * Leave room (and disconnect)
   *
   * @function leave
   * @param {string} playerId - ID of the player
   *
   * @fires player_added
   * @fires player_removed
   */

  leave: function (playerId) {
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
