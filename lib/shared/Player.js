/*global window, exports */
var SOG = SOG || {};
SOG.shared = SOG.shared || {};

(function () {
	'use strict';

	SOG.shared.Player = function (data) {
		this.get = function (field) { return field === 'all' ? data : data[field]; };

		this.setSocketID = function (id) { data.socket = id; };
		this.getSocketID = function () { return data.socket; };
		this.setFullName = function (name) { data.name = name; };
		this.getFullName = function () { return data.name; };
	};

	SOG.shared.Player.prototype.listFriends = function (field) {
		// Return specific data on every user
		return this.get('all').friends.data.map(function (f) { return f[field || 'id']; });
	};

	SOG.shared.Player.prototype.getFriends = function (ids) {
		// Return all friends in param
		return this.get('all').friends.data.filter(function (friend) { return ids.indexOf(friend.id) !== -1; });
	};

	if (typeof window === 'undefined') {
		exports.Player = SOG.shared.Player;
	}
}());
