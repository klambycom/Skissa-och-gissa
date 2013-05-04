/*jslint browser: true */

var SOG = SOG || {};
SOG.browser = SOG.browser || {};

SOG.browser.points = (function (Point) {
	'use strict';

	var color = '#df4b26',
		size = 5,
		points = [];

	return {
		add: function (x, y, dragging) {
			var p;
			if (x instanceof Object) {
				p = new Point(x.x, x.y, !!x.dragging, x.color, x.size);
			} else {
				p = new Point(x, y, !!dragging, color, size);
			}
			points.push(p);
			return p;
		},

		test: function () { return points; },

		setColor: function (c) { color = c; },

		setSize: function (s) { size = s; },

		clear: function () { points = []; },

		each: function (fn) {
			var i, previous, current;
			for (i = 0; i < points.length; i += 1) {
				previous = points[i - 1] && points[i - 1].data();
				current = points[i].data();
				fn(previous, current);
			}
		},

		last: function (fn) {
			var i = points.length - 1,
				previous = points[i - 1] && points[i - 1].data(),
				current = points[i].data();
			fn(previous, current);
		}
	};
}(SOG.browser.Point));
