/*global window, exports */
var SOG = SOG || {};
SOG.shared = SOG.shared || {};

(function () {
	'use strict';

	var Player = function (data) {
		this.getAllData = function () { return data; };
		this.getSocketID = function () { return data.socket; };
		this.setSocketID = function (id) { data.socket = id; };
		this.getFullName = function () { return data.name; };
		this.setFullName = function (name) { data.name = name; };
		this.getFriends = function () { return data.friends.data; };
		this.updateData = function (d) { data = d; };
	};

	Player.prototype.listFriends = function (field) {
		// Return specific data on every user
		return this.getFriends().map(function (f) { return f[field || 'id']; });
	};

	Player.prototype.getFriendsFromIds = function (ids) {
		// Return all friends in param
		return this.getFriends().filter(function (f) { return ids.indexOf(f.id) !== -1; });
	};

	if (typeof window === 'undefined') {
		exports.Player = Player;
	} else {
		SOG.shared.Player = Player;
	}
}());
