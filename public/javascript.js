/*jslint browser: true, devel: true */
/*global SOG, FB, Handlebars */

//(function (d) {
//	'use strict';
//
//	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
//	if (d.getElementById(id)) { return; }
//	js = d.createElement('script');
//	js.id = id;
//	js.async = true;
//	js.src = "//connect.facebook.net/en_US/all.js";
//	ref.parentNode.insertBefore(js, ref);
//}(document));
//
window.onload = function () {
	'use strict';

	var player = new SOG.browser.Player({ name: 'Christian ' + Date.now() + 'son' }),
		room = new SOG.browser.Room({ id: 'room', name: 'Lobby' }),
		gamesList = [].slice.call(document.querySelectorAll('#games .game')),
		wordNode,
		startGame,
		showErrorMessage;

	// Start game
	startGame = function () {
		// Html for game
		document.getElementById('page-wrapper').innerHTML = Handlebars.templates['room.hbs']({});

		var gameplan = document.querySelector('#gameplan'),
			chatInputField = document.querySelector('#chat-input input'),
			chatMessages = document.querySelector('#chat-messages'),
			chat = SOG.browser.chat,
			artboard = SOG.browser.artboard;

		// Init chat
		chat.init({ input: chatInputField, messages: chatMessages, player: player });

		// Show messages in chat sent by users
		room.onUserMessage(chat.createMessage);

		// Show messages in chat sent by server
		room.onServerMessage(chat.createMessage);

		// Init artboard
		artboard.init({
			canvas: document.querySelector('#artboard'),
			x: gameplan.offsetLeft + 5,
			y: gameplan.offsetTop + 5,
			room: room
		});

		// Correct word
		room.onCorrectWordGuessed(function (data) {
			// Remove old word
			if (typeof wordNode !== 'undefined') {
				document.body.removeChild(wordNode);
			}
			// Show new word
			wordNode = SOG.utils.html('div', {
				id: 'word-wrapper',
				text: '<div id="word"><span class="text">Din tur att rita</span><span class="word">' + data.next.word + '</span>',
				to: document.body
			});
			setTimeout(function () { wordNode.classList.add('small'); }, 2000);
			// Save drawing in chat
			chat.createMessage({
				img: artboard.getImage(),
				word: data.word
			});

			// Debugging, TODO remove
			console.log(data);
			console.log('correct word: ' + data.word);
		});
	};

	// Show error message
	showErrorMessage = function (message) {
		console.log('An error occured: ' + message);
	};

	// Join room
	player.join(room);

	player.onDataChanged(function (p) {
		console.log(p);
	});

	// Change room
	gamesList.forEach(function (game) {
		game.addEventListener('click', function (e) {
			room.changeTo(game.dataset.name, { success: startGame, fail: showErrorMessage });
			e.preventDefault();
		});
	});


//	function signedIn() {
//		console.log('inloggad');
//		FB.api('/me?fields=id,name,first_name,username,picture,link,friends.fields(id,name,picture)', function (d) {
//			// Save user data
//			player.updateDataSkit(d);
//			// Change on the page
//			var facebook_div = document.querySelector('#facebook'),
//				template = Handlebars.templates['facebook.hbs'],
//				html = template({ name: player.getFullName(), picture: player.getPicture() });
//			facebook_div.innerHTML = html;
//		});
//	}
//
//	function login() {
//		var btn = document.querySelector('#fb-login-button');
//		btn.addEventListener('click', function (e) {
//			e.preventDefault();
//			FB.login(function (res) {
//				if (res.authResponse) {
//					signedIn();
//				}
//			});
//		});
//	}
//
//	function logout() {
//		FB.logout(function () {
//			console.log('bye');
//		});
//	}
//
//	window.lo = logout;
//
//	window.fbAsyncInit = function () {
//		FB.init({
//			appId      : '539892936062898', //App ID
//			channelUrl : '//localhost:3000/channel.html', // Channel File
//			status     : true, // Check login status
//			cookie     : true, // Enable cookies to allow the server to access the session
//			xfbml      : true // Parse XFBML
//		});
//		// Additional init code here
//		FB.getLoginStatus(function (response) {
//			if (response.status === 'connected') {
//				// Inloggad
//				signedIn();
//			} else {
//				login();
//			}
//		});
//	};
//
//	window.tt = player;
//
//	/*
//	SOG.utils.mediator.subscribe('wat', function (data) {
//		console.log(data.msg);
//	});
//	window.testSendMsg = function (msg) {
//		SOG.utils.mediator.publish('wat', { msg: msg });
//	};
//	*/
};
