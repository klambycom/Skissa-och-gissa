/*global io, SOG */

/**
 * @namespace browser
 */
SOG.utils.namespace('SOG.browser.Room');

(function () {
	'use strict';

	/**
	 * Represents a Room.
	 *
	 * @class Room
	 * @extends shared.Room
	 * @constructor
	 * @param options {object} Room options.
	 */
	SOG.browser.Room = function (options) {
		SOG.shared.Room.call(this, options);
		this.set('socket', io.connect('http://localhost:3000/'));
	};

	SOG.browser.Room.prototype = Object.create(SOG.shared.Room.prototype);

	/**
	 * Fired when a new user-message is sent from the server.
	 *
	 * @event onUserMessage
	 * @param fn {function} The callback function that takes parameters player,
	 *                      text and all data.
	 */
	SOG.browser.Room.prototype.onUserMessage = function (fn) {
		this.get('socket').on('user-message', function (data) {
			var player = new SOG.browser.Player(data.player);
			fn(player, data.text, data);
		});
	};

	/**
	 * Fired when a new server-message is sent from the server.
	 *
	 * @event onServerMessage
	 * @param fn {function} The callback function that takes parameters type
	 *                      and text.
	 */
	SOG.browser.Room.prototype.onServerMessage = function (fn) {
		this.get('socket').on('server-message', function (data) {
			fn(data.type || '', data.text);
		});
	};

	/**
	 * Send points to server.
	 *
	 * @method sendPoints
	 * @param point {object} The point. TODO See if param really is a object.
	 */
	SOG.browser.Room.prototype.sendPoints = function (point) {
		this.get('socket').emit('canvas', point);
	};

	/**
	 * Fired when a point is received from server.
	 *
	 * @event onReceivePoint
	 * @param fn {function} Callback function.
	 */
	SOG.browser.Room.prototype.onReceivePoint = function (fn) {
		this.get('socket').on('canvas', fn);
	};

	/**
	 * Fired when correct word is guessed.
	 *
	 * @event onCorrectWordGuessed
	 * @param fn {function} Callback function. With a object as param (TODO Keys?).
	 */
	SOG.browser.Room.prototype.onCorrectWordGuessed = function (fn) {
		this.get('socket').on('correct-word', fn);
	};

	/**
	 * Change room.
	 *
	 * @method changeTo
	 * @param room {string} The ID/name of the room.
	 * @param fn {object} Success (fn.success) and fail (fn.fail)
	 *                    callback-functions.
	 */
	SOG.browser.Room.prototype.changeTo = function (room, fn) {
		// Ask to join room
		this.get('socket').emit('join-room', room);
		// Take care of response
		this.get('socket').on('join-room', function (data) {
			if (data.success) {
				fn.success();
			} else {
				fn.fail(data.message);
			}
		});
	};
}());
