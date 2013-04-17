/*global window, exports */
var SOG = SOG || {};
SOG.shared = SOG.shared || {};

(function () {
	'use strict';

	SOG.shared.Player = function (data) {
		this.getAllData = function () { return data; };
		this.setSocketID = function (id) { data.socket = id; };
		this.getSocketID = function () { return data.socket; };
		this.setFullName = function (name) { data.name = name; };
		this.getFullName = function () { return data.name; };
	};

	SOG.shared.Player.prototype.listFriends = function (field) {
		// Return specific data on every user
		return this.getAllData().friends.data.map(function (f) { return f[field || 'id']; });
	};

	SOG.shared.Player.prototype.getFriends = function (ids) {
		// Return all friends in param
		return this.getAllData().friends.data.filter(function (friend) { return ids.indexOf(friend.id) !== -1; });
	};

	if (typeof window === 'undefined') {
		exports.Player = SOG.shared.Player;
	}
}());
