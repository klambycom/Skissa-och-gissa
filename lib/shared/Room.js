var SOG = SOG || {};
SOG.shared = SOG.shared || {};

(function () {
	'use strict';

	SOG.shared.Room = function (options) {
		this.get = function (key) { return options[key]; };
		this.set = function (key, value) { options[key] = value; };
	};
}());
