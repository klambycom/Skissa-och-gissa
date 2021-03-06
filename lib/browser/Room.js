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
			data.player = new SOG.browser.Player(data.player);
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
	 * @param roomId {string}
	 * @param cb {function}
	 */
	SOG.browser.Room.prototype.changeTo = function (room, cb) {
		// Ask to join room
		this.get('socket').emit('join-room', room);
		// Take care of response
		this.get('socket').on('join-room', function (data) {
			data.players = data.players.map(function (p) {
				return new SOG.browser.Player(p);
			});
			cb(data);
		});
	};
}());
