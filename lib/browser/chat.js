/*global Handlebars */
/*global SOG */

SOG.utils.namespace('SOG.browser.chat');

SOG.browser.chat = (function () {
	'use strict';

	var inputField, messages, thisPlayer,
		messageTemplate = Handlebars.templates['message.hbs'],
		serverMessageTemplate = Handlebars.templates['servermessage.hbs'],
		doneMessageTemplate = Handlebars.templates['donemessage.hbs'];

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

		createMessage: function (from, message, options) {
			var html;

			if (typeof from.img === 'string') {
				html = doneMessageTemplate(from);
			} else if (typeof from === 'string' || from instanceof String) {
				html = serverMessageTemplate({ message: message });
			} else {
				html = messageTemplate({
					name: thisPlayer.getFullName(),
					picture: 'gfx/nopic30.png',
					message: message,
					css: (options.win) ? ' win' : ''
				});
			}

			messages.innerHTML = html + messages.innerHTML;
		}
	}
}());
