/*global SOG */

SOG.utils.namespace('SOG.browser.crayons');

SOG.browser.crayons = (function (currying) {
	'use strict';

	var change, size, color;

	change = (function () {
		var last = {};
		return function (type, e) {
			var self = e.target || e;

			// Shift selected-class
			if (typeof last[type] !== 'undefined') {
				last[type].classList.remove('selected');
			}
			last[type] = self;
			self.classList.add('selected');
			// Change color or size
			SOG.browser.artboard['set' + type.capitalize()](self.getAttribute('data-' + type));
			if (e.preventDefault) { e.preventDefault(); }
		};
	}());

	color = currying(change, 'color');
	size = currying(change, 'size');

	return {
		init: function (dom) {
			// Select default
			color(dom.colors[1]);
			size(dom.sizes[0]);
			// Add event listeners
			dom.sizes.forEach(function (s) { s.addEventListener('click', size); });
			dom.colors.forEach(function (c) { c.addEventListener('click', color); });
		}
	}
}(SOG.utils.currying));
