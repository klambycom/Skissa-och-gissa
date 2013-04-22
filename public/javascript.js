/*jslint browser: true, devel: true */
/*global SOG, FB */

(function (d) {
	'use strict';

	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) { return; }
	js = d.createElement('script');
	js.id = id;
	js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js";
	ref.parentNode.insertBefore(js, ref);
}(document));

window.onload = function () {
	'use strict';

	var room = new SOG.browser.Room({ id: 'room', name: 'Lobby' }),
		player = new SOG.browser.Player({ name: 'Christian ' + Date.now() + 'son' });

	player.join(room);

	player.onDataChanged(function (p) {
		console.log(p);
	});

	room.onUserMessage(function (from, text) {
		console.log(from.getFullName() + ' >> ' + text);
	});

	room.onServerMessage(function (type, text) {
		console.log('# ' + text);
	});

	window.testSendMsg = function (msg) {
		player.sendMessage(msg);
	};

	SOG.browser.artboard.init(document.querySelector('#artboard'));

	window.fbAsyncInit = function () {
		FB.init({
			appId      : '539892936062898', //App ID
			channelUrl : '//localhost:3000/channel.html', // Channel File
			status     : true, // Check login status
			cookie     : true, // Enable cookies to allow the server to access the session
			xfbml      : true // Parse XFBML
		});
		// Additional init code here
		FB.getLoginStatus(function (response) {
			if (response.status === 'connected') {
				// Inloggad
				FB.api('/me?fields=id,name,first_name,username,picture,locale,link,friends.fields(id,name,picture)', function (d) {
					player.updateDataSkit(d);
				});
			} else {
				FB.login(function (res) {
					if (res.authResponse) {
						console.log('vafan2');
						FB.api('/me?fields=id,name,first_name,username,picture,locale,link,friends.fields(id,name,picture)', player.updateData);
					}
				});
			}
		});
	};

	window.tt = player;

	/*
	SOG.utils.mediator.subscribe('wat', function (data) {
		console.log(data.msg);
	});
	window.testSendMsg = function (msg) {
		SOG.utils.mediator.publish('wat', { msg: msg });
	};
	*/
};
