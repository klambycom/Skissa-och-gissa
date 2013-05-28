/*jslint browser: true */
/*global SOG, Handlebars */

SOG.utils.namespace('SOG.browser.lobby');

SOG.browser.lobby = (function () {
	'use strict';

	var socket, games, addRoom, removeRoom, updateRoom, gameSelected, click;

	click = function (g) {
		return function (e) {
			gameSelected(g);
			e.preventDefault();
		};
	};

	addRoom = function (data) {
		var game, fragment;

		if (data instanceof Array) {
			fragment = document.createDocumentFragment();

			data.forEach(function (d) {
				game = SOG.utils.html('article', {
					'class': 'game ' + d.difficulty,
					'data-name': d.id,
					text: Handlebars.templates['game.hbs'](d),
					to: fragment
				});
				game.addEventListener('click', click(d.id));
				fragment.appendChild(game);
			});

			games.innerHTML = '';
			games.appendChild(fragment);
		} else {
			game = SOG.utils.html('article', {
				'class': 'game ' + data.difficulty,
				'data-name': data.id,
				text: Handlebars.templates['game.hbs'](data),
				to: games
			});
			game.addEventListener('click', click(data.id));
		}
	};

	removeRoom = function (id) {
		games.removeChild(document.querySelector('article[data-name="' + id + '"]'));
	};

	updateRoom = function (id, data) {
		console.log(id);
		console.log(data);
	};

	return {
		init: function (s, g) {
			socket = s;
			games = g;

			socket.on('add-room', addRoom);
			socket.on('remove-room', removeRoom);
			socket.on('update-room', updateRoom);
		},

		onGameSelected: function (cb) {
			gameSelected = cb;
		}
	};
}());
