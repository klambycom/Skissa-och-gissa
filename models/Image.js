/*jslint node: true, es5: true, nomen: true */
'use strict';

var mongoose = require('mongoose'),
	graph = require('fbgraph'),
	imageSchema;

/*
 * Schema
 */
imageSchema = mongoose.Schema({
	word: String,
	url: String,
	player: { type: String, default: 'unknown' },
	created_at: { type: Date, default: Date.now }
});

/*
 * Statics
 */
imageSchema.statics.latest = function (p, cb) {
	this.model('ImageModel').findOne({ player: p }).sort({ created_at: -1 }).exec(cb);
};

imageSchema.statics.findImage = function (id, cb) {
	this.model('ImageModel').findOne({ _id: id }).exec(function (err, data) {
		graph.get(data.player + '?fields=name,link,picture', function (fberr, fb) {
			data.name = fb.name;
			data.link = fb.link;
			data.picture = fb.picture.data.url;
			cb(err, fberr, data);
		});
	});
};

module.exports = mongoose.model('ImageModel', imageSchema);
