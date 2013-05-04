/*global Handlebars */

var SOG = SOG || {};
SOG.browser = SOG.browser || {};

SOG.browser.chat = (function () {
	'use strict';

	var inputField, messages, thisPlayer,
		messageTemplate = Handlebars.templates['message.hbs'],
		serverMessageTemplate = Handlebars.templates['servermessage.hbs'];

	return {
		init: function (o) {
			// Store options
			inputField = o.input;
			messages = o.messages;
			thisPlayer = o.player;

			// Add event on input field
			inputField.addEventListener('keypress', function (e) {
				if (e.keyCode === 13) {
					thisPlayer.sendMessage(this.value);
					this.value = '';
					e.preventDefault();
				}
			});
		},

		createMessage: function (from, message) {
			var html;

			if (typeof from === 'string' || from instanceof String) {
				html = serverMessageTemplate({ message: message });
			} else {
				html = messageTemplate({
					name: thisPlayer.getFullName(),
					picture: 'http://lorempixel.com/30/30',
					message: message
				});
			}

			messages.innerHTML = html + messages.innerHTML;
		}
	}
}());
