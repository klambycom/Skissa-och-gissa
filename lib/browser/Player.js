/*jslint browser: true */
var SOG = SOG || {};
SOG.browser = SOG.browser || {};

(function () {
	'use strict';

	SOG.browser.Player = function (data) {
		SOG.shared.Player.call(this, data);
	};

	SOG.browser.Player.prototype = Object.create(SOG.shared.Player.prototype);

	SOG.browser.Player.prototype.join = function (socket) {
		var self = this;

		// Save room
		this.room = socket.get('socket');

		// Send user to server
		this.room.on('identify-player', function (data) {
			self.setSocketID(data.id);
			console.log(self.getAllData());
			self.room.emit('identify-player', self.getAllData());
		});
	};

	SOG.browser.Player.prototype.sendMessage = function (msg) {
		this.room.emit('user-message', msg);
	};
}());
