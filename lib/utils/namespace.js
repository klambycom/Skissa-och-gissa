/*global window, module */
var SOG = SOG || {};
SOG.utils = SOG.utils || {};

SOG.utils.namespace = function (ns_string) {
	'use strict';

	var parts = ns_string.split('.'),
		parent = SOG,
		i;

	// Strip redundant leading global
	if (parts[0] === 'SOG') {
		parts = parts.slice(1);
	}

	for (i = 0; i < parts.length; i += 1) {
		// Create a property if it doesn't exist
		if (typeof parent[parts[i]] === 'undefined') {
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}
	return parent;
};
