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
		page = document.getElementById('page-wrapper'),
		popup,
		closePopup;

	closePopup = function (e) {
		wrapper.classList.remove('show');
		setTimeout(function () { document.body.removeChild(wrapper); }, 500);
		page.classList.remove('blur');
		if (e && e.preventDefault) { e.preventDefault(); }
	};

	wrapper.addEventListener('click', closePopup);

	return function (options) {
		// Set escape to true if its undefined
		if (typeof options.escape === 'undefined') {
			options.escape = true;
		}

		// Blur the page
		page.classList.add('blur');

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
