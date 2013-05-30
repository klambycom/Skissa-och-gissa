/*jslint node: true, es5: true */
'use strict';

require('./lib/utils/functional');

var mongoose = require('mongoose'),
	playerSchema;

/*
 * Schema
 */
playerSchema = mongoose.Schema({
	login_service: { type: String, default: 'facebook' },
	login_id: String,
	name: String,
	picture: String,
	points: { type: Number, default: 0 },
	anonymous: { type: Boolean, default: false }
});

/*
 * Methods
 */
playerSchema.methods.addPoints = function (p, cb) {
	this.points += p;
	this.save();
	return this.points;
};

/*
 * Statics
 */
var addPointsHelper = function (points, cb, error, data) {
	if (error) {
		// Error!
		console.log(error);
	} else if (data) {
		// Player found, add points!
		var p = data.addPoints(points);
		if (cb) { cb(p, data); }
	}
};

playerSchema.statics.createAndAddPoints = function (login_id, points, cb) {
	this.model('PlayerModel').create({ login_id: login_id }, addPointsHelper.curry(points, cb));
};

playerSchema.statics.createAndOrAddPoints = function (lid, pnts, cb) {
	var self = this;
	this.model('PlayerModel').findOne({ login_id: lid }, function (error, data) {
		addPointsHelper(pnts, cb, error, data);
		if (!(error || data)) {
			// Player not found, create player, add points!
			self.model('PlayerModel').createAndAddPoints(lid, pnts, cb);
		}
	});
};

module.exports = mongoose.model('PlayerModel', playerSchema);
