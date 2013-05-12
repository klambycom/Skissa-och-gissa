/*global window, exports, SOG */

/**
 * @namespace shared
 */

(function () {
	'use strict';

	/**
	 * Represents a player.
	 *
	 * @class Player
	 * @constructor
	 * @param data {object} Information about the player, from Facebook for
	 *                      example.
	 */
	var Player = function (data) {
		/**
		 * @method getAllData
		 * @return Returns all data on player.
		 */
		this.getAllData = function () { return data; };

		/**
		 * @method getSocketID
		 * @return Returns the id from socket.
		 */
		this.getSocketID = function () { return data.socket; };

		/**
		 * @method setSocketID
		 * @param id {int} The socket id.
		 */
		this.setSocketID = function (id) { data.socket = id; };

		/**
		 * @method getFullName
		 * @return Returns the full name.
		 */
		this.getFullName = function () { return data.name; };

		/**
		 * @method setFullName
		 * @param name {string} The full name.
		 */
		this.setFullName = function (name) { data.name = name; };

		/**
		 * @method getFacebookID
		 * @return Returns the id from Facebook.
		 */
		this.getFacebookID = function () { return data.id; };

		/**
		 * @method getFirstName
		 * @return Returns the first name.
		 */
		this.getFirstName = function () { return data.first_name; };

		/**
		 * @method getPicture
		 * @return Returns the url to the picture.
		 */
		this.getPicture = function () { return data.picture.data.url; };

		/**
		 * @method getFriends
		 * @return Returns the players all friends.
		 */
		this.getFriends = function () { return data.friends.data; };

		/**
		 * @method getFacebookUsername
		 * @return Returns the username from Facebook.
		 */
		this.getFacebookUsername = function () { return data.username; };

		/**
		 * @method getFacebookLink
		 * @return Returns the url to the personal Facebook-page.
		 */
		this.getFacebookLink = function () { return data.link; };

		/**
		 * Replace the old data with the new data.
		 *
		 * @method updateData
		 * @param d {object} New data.
		 */
		this.updateData = function (d) { data = d; };
	};

	/**
	 * Get specific data from all friends.
	 *
	 * @method listFriends
	 * @param field {string} The type of information (for example 'name').
	 * @return Returns an array with specified data.
	 */
	Player.prototype.listFriends = function (field) {
		// Return specific data on every user
		return this.getFriends().map(function (f) { return f[field || 'id']; });
	};

	/**
	 * Get friends from a array with ids.
	 *
	 * @method getFriendsFromIds
	 * @param ids {array} The array with friends Facebook IDs.
	 * @return Returns en array with all Friends in the ids-array.
	 */
	Player.prototype.getFriendsFromIds = function (ids) {
		// Return all friends in param
		return this.getFriends().filter(function (f) { return ids.indexOf(f.id) !== -1; });
	};

	if (typeof window === 'undefined') {
		exports.Player = Player;
	} else {
		SOG.utils.namespace('SOG.shared.Player');
		SOG.shared.Player = Player;
	}
}());
