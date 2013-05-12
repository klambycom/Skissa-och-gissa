/*jslint browser: true */
/*global SOG */

/**
 * @namespace browser
 */
SOG.utils.namespace('SOG.browser.points');

/**
 * Represents all points for an image. Uses
 * {{#crossLink "browser.Point"}}Point{{/crossLink}}.
 *
 * @class points
 * @static
 */
SOG.browser.points = (function (Point) {
	'use strict';

	var color = '#df4b26',
		size = 5,
		points = [];

	return {
		/**
		 * Add a new Point to the drawing.
		 *
		 * @method add
		 * @param x {int} The x cordination.
		 * @param y {int} The y cordination.
		 * @param dragging {boolean} True if its not the first point in current line.
		 * @return Returns the newly created Point.
		 */
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

		// TODO Delete this.
		test: function () { return points; },

		/**
		 * Set the color. All points after the color is changed till its
		 * changed again will have the same color.
		 *
		 * @method setColor
		 * @param c {string} The new color.
		 */
		setColor: function (c) { color = c; },

		/**
		 * Set the size. All points after the size is changed til its changed
		 * again will have the same size.
		 *
		 * @method setSize
		 * @param s {int} The new size.
		 */
		setSize: function (s) { size = s; },

		/**
		 * Remove all points.
		 *
		 * @method clear
		 */
		clear: function () { points = []; },

		/**
		 * Iterate through each point.
		 *
		 * @method each
		 * @param fn {function} Callback function that takes two parameters
		 *                      (previous and current). Previous is undefined
		 *                      if its the first point.
		 */
		each: function (fn) {
			var i, previous, current;
			for (i = 0; i < points.length; i += 1) {
				previous = points[i - 1] && points[i - 1].data();
				current = points[i].data();
				fn(previous, current);
			}
		},

		/**
		 * Gets the previous and the current point.
		 *
		 * @method last
		 * @param fn {function} Callbakc function that takes two parameters
		 *                      (previous and current). Previous is undefined
		 *                      if its the first point.
		 */
		last: function (fn) {
			var i = points.length - 1,
				previous = points[i - 1] && points[i - 1].data(),
				current = points[i].data();
			fn(previous, current);
		}
	};
}(SOG.browser.Point));
