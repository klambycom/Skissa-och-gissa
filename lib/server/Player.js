/*jslint node: true */
/*global exports */
'use strict';

/**
 * @namespace server
 */

var SharedPlayer = require('../../lib/shared/Player').Player,
	PlayerModel = require('../../models');

/**
 * Represents a player
 *
 * @class Player
 * @extends shared.Player
 * @constructor
 * @param data {object} All player data.
 */
var Player = function (data) {
	SharedPlayer.call(this, data);
};

Player.prototype = Object.create(SharedPlayer.prototype);

Player.prototype.skitpoints = function (p, cb) {
	var self = this;
	PlayerModel.createAndOrAddPoints(this.getFacebookID() + Date.now(), p, function (totalAllTime) {
		var total = self.points(p);
		if (cb) { cb(total, totalAllTime, p); }
		return total;
	});
}

exports.Player = Player;
