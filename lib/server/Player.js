/*jslint node: true */
'use strict';

/**
 * @namespace server
 */

var SharedPlayer = require('../../lib/shared/Player').Player;

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

exports.Player = Player;
