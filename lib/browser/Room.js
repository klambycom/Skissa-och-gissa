/*global io */

var SOG = SOG || {};
SOG.browser = SOG.browser || {};

(function () {
	'use strict';

	SOG.browser.Room = function (options) {
		SOG.shared.Room.call(this, options);
		//this.set('socket', io.connect('http://localhost:3000/' + this.get('id')));
		this.set('socket', io.connect('http://localhost:3000/'));
	};

	SOG.browser.Room.prototype = Object.create(SOG.shared.Room.prototype);

	SOG.browser.Room.prototype.onUserMessage = function (fn) {
		this.get('socket').on('user-message', function (data) {
			var player = new SOG.browser.Player(data.player);
			fn(player, data.text);
		});
	};

	SOG.browser.Room.prototype.onServerMessage = function (fn) {
		this.get('socket').on('server-message', function (data) {
			fn(data.type, data.text);
		});
	};

	SOG.browser.Room.prototype.sendPoints = function (point) {
		this.get('socket').emit('canvas', point);
	};

	SOG.browser.Room.prototype.onReceivePoint = function (fn) {
		this.get('socket').on('canvas', function (data) {
			fn(data);
		});
	};
}());
