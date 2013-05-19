/*jslint browser: true */
/*global Handlebars, SOG */

/**
 * @namespace browser
 */
SOG.utils.namespace('SOG.browser.popup');

SOG.browser.popup = (function () {
	'use strict';

	var popupTempl = Handlebars.templates['popup.hbs'],
		wrapper = SOG.utils.html('div', { id: 'popup-wrapper' }),
		popup,
		closePopup;

	closePopup = function (e) {
		wrapper.classList.remove('show');
		setTimeout(function () { document.body.removeChild(wrapper); }, 500);
		if (e && e.preventDefault) { e.preventDefault(); }
	};

	wrapper.addEventListener('click', closePopup);

	return function (options) {
		// Add the popup to the DOM
		wrapper.innerHTML = popupTempl(options);
		document.body.appendChild(wrapper);

		// The popup div
		popup = document.getElementById('popup');

		// Dont close popup when clicking on it
		popup.addEventListener('click',  function (e) {
			e.preventDefault();
			e.stopPropagation();
		});

		// Center popup vertically
		popup.style.marginTop = ((window.innerHeight - popup.offsetHeight) / 2) + 'px';

		// Show the popup
		setTimeout(function () { wrapper.classList.add('show'); }, 10);

		return {
			close: closePopup
		};
	};
}());