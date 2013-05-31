/*jslint browser: true */
/*global mediator, SOG */

/**
 * @namespace browser
 */
SOG.utils.namespace('SOG.browser.Player');

(function () {
	'use strict';

	/**
	 * Represents a Player.
	 *
	 * @class Player
	 * @extends shared.Player
	 * @constructor
	 * @param data {object} All player data. From Facebook for example.
	 */
	var Player = function (data) {
		SOG.shared.Player.call(this, data);
	};

	Player.prototype = Object.create(SOG.shared.Player.prototype);

	/**
	 * Join a socket room.
	 *
	 * @method join
	 * @param socket {object} The Socket.io-socket.
	 */
	Player.prototype.join = function (socket) {
		var self = this;

		// Save room
		this.room = socket.get('socket');

		// Send user to server
		this.room.on('identify-player', function (data) {
			self.setSocketID(data.id);
			self.room.emit('identify-player', self.getAllData());
		});
	};

	/**
	 * Send message to other players in room.
	 *
	 * @method sendMessage
	 * @param msg {string} The message to be sent.
	 */
	Player.prototype.sendMessage = function (msg) {
		this.room.emit('user-message', msg);
	};

	/**
	 * Fired when server sends Player data.
	 *
	 * @event onDataChanged
	 * @param fn {function} Function with this as param.
	 */
	Player.prototype.onDataChanged = function (fn) {
		var self = this;
		this.room.on('update-player-data', function () {
			fn(self);
		});
	};

	/**
	 * Send new Player data to server.
	 *
	 * @method updateData
	 * @param data {object} The data to send to the server.
	 */
	Player.prototype.updateData = function (data) {
		//this.room.emit('update-player-data', data);
		SOG.shared.Player.prototype.updateData.call(this, data);
	};

	/**
	 * Send new Player data to server.
	 *
	 * @method updateDataSkit
	 * @param data {object} The data to send to the server.
	 */
	Player.prototype.updateDataSkit = function (data) {
		var d = Object.merge(data, { socket: this.getSocketID() });
		this.room.emit('identify-player', d);
		this.updateData(d);
	};

	/**
	 * Send image to server in base64-format.
	 *
	 * @method saveImage
	 * @param image {string} Image in base64-format.
	 */
	Player.prototype.saveImage = function (image) {
		this.room.emit('save-image', image);
	};

	SOG.browser.Player = Player;
}());
