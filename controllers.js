/*jslint node: true */
'use strict';

exports.controllers = [];
var save = function (v) { return function (r, f) { exports.controllers.push({ verb: v, route: r, fn: f }); }; },
	app = { get: save('get'), post: save('post'), param: save('param') };

app.get('/', function (req, res) {
	res.render('index', { text: 'World' });
});

app.get('/channel.html', function (req, res) {
	res.render('channel');
});
