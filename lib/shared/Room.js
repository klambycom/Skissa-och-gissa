/*global window, module, SOG */

/**
 * @namespace shared
 */

(function () {
	'use strict';

	/**
	 * Represents a room.
	 *
	 * @class Room
	 * @constructor
	 * @param options {object} Options for the room.
	 */
	var Room = function (options) {
		/**
		 * Getter
		 *
		 * @method get
		 * @param key {string} The room-option you want back.
		 * @return Returns the specified data.
		 */
		this.get = function (key) { return options[key]; };

		/**
		 * Setter
		 *
		 * @method set
		 * @param key {string} The key.
		 * @param value {string|object|int} The new value.
		 */
		this.set = function (key, value) { options[key] = value; };
	};

	if (typeof window === 'undefined') {
		module.exports = Room;
	} else {
		SOG.utils.namespace('SOG.shared.Room');
		SOG.shared.Room = Room;
	}
}());
