/*global window, module */
var SOG = SOG || {};
SOG.utils = SOG.utils || {};

(function () {
	'use strict';

	var currying = function (fn) {
		var slice = Array.prototype.slice,
			stored_args = slice.call(arguments, 1);

		return function () {
			var new_args = slice.call(arguments),
				args = stored_args.concat(new_args);
			return fn.apply(null, args);
		};
	};

	if (typeof window === 'undefined') {
		module.exports = currying;
	} else {
		SOG.utils.currying = currying;
	}
}());
