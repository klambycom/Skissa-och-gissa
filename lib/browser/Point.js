/*jslint browser: true */
/*global SOG */

SOG.utils.namespace('SOG.browser.Point');

(function () {
	'use strict';

	SOG.browser.Point = function (x, y, dragging, color, size) {
		this.getX = function () { return x; };
		this.getY = function () { return y; };
		this.getColor = function () { return color; };
		this.getSize = function () { return size; };
		this.getDragging = function () { return dragging; };
	};

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
