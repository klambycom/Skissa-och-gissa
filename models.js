/*jslint node: true, es5: true */
'use strict';

var mongoose = require('mongoose'),
	playerSchema;

playerSchema = mongoose.Schema({
	login_service: { type: String, default: 'facebook' },
	login_id: String,
	name: String,
	picture: String,
	points: { type: Number, default: 0 },
	anonymous: { type: Boolean, default: false }
});

playerSchema.methods.addPoints = function (p) {
	this.points += p;
	this.save();
	return this.points;
};

mongoose.model('PlayerModel', playerSchema);
