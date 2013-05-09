/*global window, module, SOG */

(function () {
	'use strict';

	var Room = function (options) {
		this.get = function (key) { return options[key]; };
		this.set = function (key, value) { options[key] = value; };
	};

	if (typeof window === 'undefined') {
		module.exports = Room;
	} else {
		SOG.utils.namespace('SOG.shared.Room');
		SOG.shared.Room = Room;
	}
}());
