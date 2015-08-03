/*jslint node: true */
/*global exports */
'use strict';

/**
 * @namespace server
 */

var SharedPlayer = require('../../lib/shared/Player').Player;
var ImageModel = require('../../src/server/db.js').player;

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
  var total = this.points(p);
  if (this.getFacebookID() !== undefined) {
    PlayerModel.createAndOrAddPoints(this.getFacebookID(), p, function (totalAllTime) {
      if (cb) { cb(total, totalAllTime, p); }
      return total;
    });
  }
}

exports.Player = Player;
