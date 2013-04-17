/*jslint browser: true, devel: true */
/*global SOG */

window.onload = function () {
	'use strict';
	var room = new SOG.browser.Room({ id: 'room', name: 'Lobby' }),
		player = new SOG.browser.Player({ name: 'Christian ' + Date.now() + 'son' });

	player.join(room);

	room.onUserMessage(function (from, text) {
		console.log(from.get('name') + ' >> ' + text);
	});

	room.onServerMessage(function (type, text) {
		console.log('# ' + text);
	});

	window.testSendMsg = function (msg) {
		player.sendMessage(msg);
	};
};
