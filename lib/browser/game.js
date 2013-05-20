/*global io, SOG */

/**
 * @namespace browser
 */
SOG.utils.namespace('SOG.browser.game');

SOG.browser.game = (function () {
	'use strict';

	var socket = io.connect('http://localhost:3000/'),
		strings = {
			'GameNotFoundException': {
				title: 'Spelet hittades inte',
				message: 'Spelet finns inte längre. Du har kanske fått en gammal länk eller inte laddat om sidan på länge.',
				extra: 'Lösning: Det borde fungera att ladda om sidan!'
			},
			'GameIsFullException': {
				title: 'Spelet är fullt',
				message: 'Det får tyvärr inte plats med fler spelare i detta spelet. Det borde finnas fler spel i samma kategori.'
			},
			'DisconnectedException': {
				title: ':(',
				message: 'Anslutningen till servern har brutits. Möjliga anledningar: <ul><li>Jag uppdaterar spelet (bra).</li><li>Servern har kraschat (dåligt).</li></ul>',
				extra: 'Vänta ett par minuter så borde spelet laddas om av sig själv.',
				escape: false
			}
		};

	return {
		/**
		 * Fired when a error occurs on the server.
		 *
		 * @event onError
		 * @param cb {function}
		 */
		onError: function (cb) {
			socket.on('error-message', cb);
			socket.on('disconnect', cb.curry({ name: 'DisconnectedException' }));
		},

		/**
		 * @method getSocket
		 * @return Returns the socket.
		 */
		getSocket: function () { return socket; },

		/**
		 * @method str
		 * @param id {string}
		 * @return Returns the string with that id.
		 */
		str: function (id) { return strings[id]; }
	};
}());
