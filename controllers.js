/*jslint node: true, nomen: true */
'use strict';

exports.controllers = [];
var save = function (v) { return function (r, f) { exports.controllers.push({ verb: v, route: r, fn: f }); }; },
	app = { get: save('get'), post: save('post'), param: save('param') };

var SharedPlayer = require('./lib/shared/Player').Player,
	PlayerModel = require('./models/Player'),
	ImageModel = require('./models/Image');

var fs = require('fs');

app.get('/', function (req, res) {
	PlayerModel.highscore(function (err, docs) {
		res.render('index', { text: 'World', highscore: docs });
	});
});

app.get('/room', function (req, res) {
	res.render('room', { text: 'World' });
});

app.get('/channel.html', function (req, res) {
	res.render('channel');
});

app.get('/p/:player/latest', function (req, res) {
	ImageModel.latest(req.params.player, function (err, data) {
		res.redirect('/img/' + data._id);
	});
});

app.get('/img/all', function (req, res) {
	ImageModel.find().exec(function (err, data) {
		res.render('show_all_images', { images: data, layout: false });
	});
});

app.get('/img/:id', function (req, res) {
	ImageModel.findImage(req.params.id, function (err, fberr, data) {
		data.layout = false;
		res.render('show_image', data);
	});
});
