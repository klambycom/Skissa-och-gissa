var SOG = SOG || {};
SOG.shared = SOG.shared || {};

(function () {
	'use strict';

	SOG.shared.Player = function (data) {
		this.get = function (field) { return field === 'all' ? data[field] : data; };
		this.listFriends = function (field) {
			return data.friends.data.map(function (f) { return f[field || 'id']; });
		};
		this.getFriends = function (ids) {
			return data.friends.data.filter(function (friend) { return ids.indexOf(friend.id) !== -1; });
		};
	};
}());
