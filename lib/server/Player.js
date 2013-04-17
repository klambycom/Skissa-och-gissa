/*jslint node: true */
'use strict';

var SharedPlayer = require('../../lib/shared/Player').Player;

var Player = function (data) {
	SharedPlayer.call(this, data);
};

Player.prototype = Object.create(SharedPlayer.prototype);

exports.Player = Player;
