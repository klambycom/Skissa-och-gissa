var SOG = SOG || {};
SOG.browser = SOG.browser || {};

(function () {
	'use strict';

	SOG.browser.Player = function (data) {
		SOG.shared.Player.call(this, data);
	};

	SOG.browser.Player.prototype = Object.create(SOG.shared.Player.prototype);

	SOG.browser.Player.prototype.join = function (socket) {
		// TODO Take care of hand shake
		this.room = socket.get('socket');
	};

	SOG.browser.Player.prototype.sendMessage = function (msg) {
		this.room.emit('user-message', msg);
	};
}());
