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
		closePopup,
		createPopup,
		createSimplePopup,
		btnWrapper,
		addBtn;

	closePopup = function (e) {
		wrapper.classList.remove('show');
		setTimeout(function () { document.body.removeChild(wrapper); }, 500);
		page.classList.remove('blur');
		if (e && e.preventDefault) { e.preventDefault(); }
		wrapper.removeEventListener('click', closePopup);
	};

	createPopup = function (options) {
		// Set escape to true if its undefined
		if (typeof options.escape === 'undefined') {
			options.escape = true;
		}

		// Close by clicking on the background
		if (options.closeable || typeof options.closeable === 'undefined') {
			wrapper.classList.remove('not-closeable');
			wrapper.addEventListener('click', closePopup);
		} else {
			wrapper.classList.add('not-closeable');
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

	};

	createSimplePopup = function (options) {
		var msg = options.message || options,
			wrapper = SOG.utils.html('div', {
				id: 'simple-popup-message-wrapper',
				to: document.body
			}),
			message = SOG.utils.html('div', {
				'class': 'simple-popup-message',
				text: msg,
				to: wrapper
			});

		setTimeout(function () { document.body.removeChild(wrapper); }, 10000);

		return wrapper;
	};

	addBtn = function (text, cb, classname) {
		if (!btnWrapper) {
			btnWrapper = SOG.utils.html('div', { 'class': 'buttons', to: popup });
		}

		var btn = SOG.utils.html('a', {
			'class': classname || 'ok-btn',
			text: text,
			to: btnWrapper
		});

		if (typeof cb === 'string') {
			btn.setAttribute('href', cb);
		} else {
			btn.addEventListener('click', function (e) {
				cb();
				e.preventDefault();
			});
		}
	};

	return function (options, type) {
		if (type === 'simple') {
			return createSimplePopup(options);
		}

		createPopup(options);
		return {
			close: closePopup,
			addBtn: addBtn
		};
	};
}());
