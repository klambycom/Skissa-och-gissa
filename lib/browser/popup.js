/*jslint browser: true */
/*global Handlebars, SOG */

/**
 * @namespace browser
 */
SOG.utils.namespace('SOG.browser.popup');

SOG.browser.popup = (function () {
	'use strict';

	var popupTempl = Handlebars.templates['popup.hbs'],
		wrapper = SOG.utils.html('div', { 'class': 'popup-wrapper', to: document.body });

	return function (options) {
		wrapper.innerHTML = popupTempl(options);
	};
}());
