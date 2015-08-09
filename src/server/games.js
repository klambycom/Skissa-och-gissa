/**
 * # Games
 *
 * Handle games, and let users join and leave games.
 *
 * @module games
 */

module.exports = {

  /**
   * Join a room, and leave a old room if specified
   *
   * @function join
   *
   * @fires player_added
   * @fires player_removed
   */

  join: function (player, room, oldRoom) {
  },

  /**
   * Leave room (and disconnect)
   *
   * @function leave
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
   */

  players: function (room) {
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
