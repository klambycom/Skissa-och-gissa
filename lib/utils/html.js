/*jslint browser: true */

var SOG = SOG || {};
SOG.utils = SOG.utils || {};

SOG.utils.html = function (type, attributes) {
	'use strict';

	var n = document.createElement(type),
		as = attributes || {};
	// Append to parent
	if (as.to) {
		as.to.appendChild(n);
		delete as.to;
	}
	// Text
	if (as.text) {
		n.innerHTML = as.text;
		delete as.text;
	}
	// Href
	if (type === 'a' && !as.href) { n.setAttribute('href', '#'); }
	// Other attributes
	Object.keys(as).forEach(function (a) { n.setAttribute(a, as[a]); });

	return n;
};
