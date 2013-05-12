/*global SOG */

/**
 * @namespace browser
 * @requires SOG.utils.currying, SOG.browser.artboard
 */
SOG.utils.namespace('SOG.browser.crayons');

/**
 * Make size and color buttons work. Uses
 * {{#crossLink "browser.artboard/setColor:method"}}setColor{{/crossLink}} and
 * {{#crossLink "browser.artboard/setSize:method"}}setSize{{/crossLink}}
 * from SOG.browser.artboard.
 *
 * @class crayons
 * @static
 */
SOG.browser.crayons = (function (currying) {
	'use strict';

	var change, size, color;

	/**
	 * Call appropriate browser.artboard function.
	 *
	 * @method change
	 * @private
	 * @param type {string} Color or size.
	 * @param e {object} Event.
	 */
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

	color = change.curry('color');
	size = change.curry('size');

	return {
		/**
		 * Init
		 *
		 * @method init
		 * @param dom {object} Array with node for colors and node for sizes.
		 * @example
		 *     browser.crayons.init({
		 *         colors: [node, node],
		 *         sizes: [node, node]
		 *     });
		 */
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
