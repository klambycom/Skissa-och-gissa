/*global io, SOG */

/**
 * @namespace browser
 */
SOG.utils.namespace('SOG.browser.game');

SOG.browser.game = (function () {
	'use strict';

	var socket = io.connect('http://skissaochgissa-klamby.rhcloud.com:8000'),
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
				message: 'Anslutningen till servern har brutits. Möjliga anledningar: <ul><li>Jag uppdaterar spelet</li><li>Servern har kraschat</li><li>Du har varit inaktiv väldigt länge</li></ul>',
				extra: 'Vänta ett par minuter och testa sen att ladda om sidan.',
				escape: false,
				closeable: false
			},
			'ScoreMessage': "{gName} fick {gPoints} ponäng efter att ha gissat rätt. {dName} fick {dPoints} poäng för att har ritat så bra."
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
		 * Fired when game is over.
		 *
		 * @event onGameOver
		 * @param cb {function}
		 */
		onGameOver: function (cb) {
			socket.on('game-over', cb);
		},

		/**
		 * Fired when client connects to websocket.
		 *
		 * @event onConnect
		 * @param cb {function}
		 */
		onConnect: function (cb) {
			socket.on('connect', cb);
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
		str: function (id) { return strings[id]; },

		/**
		 * @method onPoints
		 * @param cb {function} First param is an object with guesser and
		 *                      next is for the drawer (player, points, total).
		 */
		onPoints: function (cb) {
			socket.on('update-points', function (data) {
				cb({
					player: new SOG.browser.Player(data.guess_player),
					points: data.guess_points,
					total: data.guess_total
				}, {
					player: new SOG.browser.Player(data.draw_player),
					points: data.draw_points,
					total: data.draw_total
				});
			});
		}
	};
}());
