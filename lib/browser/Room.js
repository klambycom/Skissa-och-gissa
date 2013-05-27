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
		this.set('socket', options.socket);
	};

	SOG.browser.Room.prototype = Object.create(SOG.shared.Room.prototype);

	/**
	 * Fired when player joins the room.
	 *
	 * @event onPlayerJoinsRoom
	 * @param fn {function} The callback function. Param: player, data.
	 */
	SOG.browser.Room.prototype.onPlayerJoinsRoom = function (fn) {
		this.get('socket').on('player-joined-room', function (data) {
			var player = new SOG.browser.Player(data.player);
			fn(player, data);
		});
	};

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
		this.get('socket').on('correct-word', function (data) {
			data.next.player = new SOG.browser.Player(data.next.player);
			fn(data);
		});
	};

	SOG.browser.Room.prototype.onLeaveRoom = function (cb) {
		this.get('socket').on('leave-room', function (data) {
			cb(data.name, data.id);
		});
	};

	/**
	 * Change room.
	 *
	 * @method changeTo
	 * @param room {string} The ID/name of the room.
	 * @param fn {object} Object with callback-functions.
	 *        @param fn.success {function} Success callback.
	 *        @param fn.fail {function} Fail callback.
	 */
	SOG.browser.Room.prototype.changeTo = function (room, fn) {
		// Ask to join room
		this.get('socket').emit('join-room', room);
		// Take care of response
		this.get('socket').on('join-room', function (data) {
			if (data.success) {
				data.players = data.players.map(function (p) {
					return new SOG.browser.Player(p);
				});
				fn.success(data);
			} else {
				fn.fail(data.message);
			}
		});
	};
}());
