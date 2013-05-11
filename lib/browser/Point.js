/*jslint browser: true */
/*global SOG */

/**
 * @namespace browser
 */
SOG.utils.namespace('SOG.browser.Point');

(function () {
	'use strict';

	/**
	 * Represents a Point.
	 *
	 * @class Point
	 * @constructor
	 * @param x {int} The x cordination.
	 * @param y {int} The y cordination.
	 * @param dragging {boolean} True if not the first point.
	 * @param color {string} The color of the point.
	 * @param size {int} The size of the point.
	 */
	SOG.browser.Point = function (x, y, dragging, color, size) {
		/**
		 * @method getX
		 * @return {int} The x cordination.
		 */
		this.getX = function () { return x; };
		/**
		 * @method getY
		 * @return {int} The y cordination.
		 */
		this.getY = function () { return y; };
		/**
		 * @method getColor
		 * @return {string} The color of the point.
		 */
		this.getColor = function () { return color; };
		/**
		 * @method getSize
		 * @return {int} The size of the point.
		 */
		this.getSize = function () { return size; };
		/**
		 * @method getDragging
		 * @return {boolean} True if not the first point.
		 */
		this.getDragging = function () { return dragging; };
	};

	/**
	 * Get all data about the point.
	 *
	 * @method data
	 * @return {Object} Returns a object with all data (x, y, color, size, dragging).
	 */
	SOG.browser.Point.prototype.data = function () {
		return {
			x: this.getX(),
			y: this.getY(),
			color: this.getColor(),
			size: this.getSize(),
			dragging: this.getDragging()
		}
	};
}());
