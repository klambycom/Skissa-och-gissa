/*jslint browser: true, devel: true */
/*global SOG */

window.onload = function () {
	'use strict';
	var room = new SOG.browser.Room({ id: 'room', name: 'Lobby' }),
		player = new SOG.browser.Player({ name: 'Christian Nilsson' });

	player.join(room);

	room.onUserMessage(function (from, text) {
		console.log('>> ' + text);
	});

	room.onServerMessage(function (data) {
		console.log('# ' + data);
	});

	window.testSendMsg = function (msg) {
		player.sendMessage(msg);
	};
};
