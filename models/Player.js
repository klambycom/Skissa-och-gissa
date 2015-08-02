/*jslint node: true, es5: true */
'use strict';

require('../lib/utils/functional');

var mongoose = require('mongoose'),
	playerSchema,
	graph = require('fbgraph');

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

playerSchema.statics.highscore = (function () {
	var saved_result, saved_date;

	return function (cb) {
		if (saved_date + (1000 * 60 * 60) > Date.now()) {
			cb(undefined, saved_result);
			return;
		}

		return this.model('PlayerModel').find().sort({ points: -1 }).limit(5).exec(function (err, data) {
			var fbIds = data.map(function (i) { return 'uid = ' + i.login_id; }).join(' OR '),
				query = 'SELECT uid, name, pic_square FROM user WHERE ' + fbIds;

			graph.fql(query, function (fbErr, res) {
        var result = [];

        try {
          var result = data.map(function (i) {
            var fb = res.data.filter(function (f) { return f.uid === +i.login_id; })[0];
            return {
              login_id: i.login_id,
              points: i.points,
              name: fb.name,
              picture: fb.pic_square
            };
          });
        } catch (e) {
          console.log('models/Player.js:highscore', res, fbErr, result);
        }

				if (!err && !fbErr) {
					saved_result = result;
					saved_date = Date.now();
				}
				cb({ mongo: err, facebook: fbErr }, result);
			});
		});
	};
}());

module.exports = mongoose.model('PlayerModel', playerSchema);
