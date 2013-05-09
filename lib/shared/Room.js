/*global window, module */
var SOG = SOG || {};
SOG.shared = SOG.shared || {};

(function () {
	'use strict';

	var Room = function (options) {
		this.get = function (key) { return options[key]; };
		this.set = function (key, value) { options[key] = value; };
	};

	if (typeof window === 'undefined') {
		module.exports = Room;
	} else {
		SOG.shared.Room = Room;
	}
}());
