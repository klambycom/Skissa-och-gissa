/*jslint browser: true */
/*global mediator, SOG */

SOG.utils.namespace('SOG.browser.Player');

(function () {
	'use strict';

	var Player = function (data) {
		SOG.shared.Player.call(this, data);
	};

	Player.prototype = Object.create(SOG.shared.Player.prototype);

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

	Player.prototype.sendMessage = function (msg) {
		this.room.emit('user-message', msg);
	};

	Player.prototype.onDataChanged = function (fn) {
		var self = this;
		this.room.on('update-player-data', function () {
			fn(self);
		});
	};

	Player.prototype.updateData = function (data) {
		//this.room.emit('update-player-data', data);
		SOG.shared.Player.prototype.updateData.call(this, data);
	};

	Player.prototype.updateDataSkit = function (data) {
		this.room.emit('update-player-data', data);
		this.updateData(data);
	};

	Player.prototype.saveImage = function (image) {
		this.room.emit('save-image', image);
	};

	SOG.browser.Player = Player;
}());
