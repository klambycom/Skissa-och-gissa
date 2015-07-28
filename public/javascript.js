/*jslint browser: true, devel: true */
/*global SOG, FB, Handlebars */

// Default player name
SOG.player = new SOG.browser.Player({ name: 'Anonym (' + Date.now() + ')' });

function signedIn() {
	'use strict';
	console.log('inloggad');
	FB.api('/me?fields=id,name,first_name,username,picture,link,friends.fields(id,name,picture)', function (d) {
		// Save user data
		SOG.player.updateDataSkit(d);
		// Change on the page
		var facebook_div = document.querySelector('#facebook'),
			template = Handlebars.templates['facebook.hbs'],
			html = template({ name: SOG.player.getFullName(), picture: SOG.player.getPicture() });
		facebook_div.innerHTML = html;
	});
}

function login() {
	'use strict';
	var btn = document.querySelector('#fb-login-button');
	btn.addEventListener('click', function (e) {
		e.preventDefault();
		FB.login(function (res) {
			if (res.authResponse) {
				signedIn();
			}
		});
	});
}

function logout() {
	'use strict';
	FB.logout(function () {
		console.log('bye');
	});
}

window.fbAsyncInit = function () {
	'use strict';
	console.log('fbAsyncInit');
	FB.init({
		appId      : '539892936062898', //App ID
		//appId      : '614840228526917', //App ID
		channelUrl : '//localhost:3000/channel.html', // Channel File
		status     : true, // Check login status
		cookie     : true, // Enable cookies to allow the server to access the session
		xfbml      : true // Parse XFBML
	});
	// Additional init code here
	FB.getLoginStatus(function (response) {
		if (response.status === 'connected') {
			// Inloggad
			console.log('signed in');
			signedIn();
		} else {
			console.log('log in');
			login();
		}
	});
};

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

	var game = SOG.browser.game,
		room = new SOG.browser.Room({ id: 'room', name: 'Lobby', socket: game.getSocket() }),
		gamesList = [].slice.call(document.querySelectorAll('#games .game')),
		wordNode,
		startGame,
		showErrorMessage,
		pageWrapper = document.getElementById('page-wrapper'),
		gameWrapper = document.getElementById('game-wrapper');

	// Init lobby
	SOG.browser.lobby.init(game.getSocket(), document.getElementById('games'));

	// Start game
	startGame = function (data) {
		// Html for game
		gameWrapper.innerHTML = Handlebars.templates['room.hbs']({ picture: SOG.player.getPicture() });

		var gameplan = document.getElementById('gameplan'),
			chatInputField = document.querySelector('#chat-input input'),
			chatMessages = document.getElementById('chat-messages'),
			playersList = document.querySelector('#game-user-info .players'),
			timer = document.getElementById('timer-progress'),
			artboardWrapper = document.getElementById('artboard-wrapper'),
			playerTmpl = Handlebars.templates['player.hbs'],
			chat = SOG.browser.chat,
			artboard = SOG.browser.artboard,
			addPlayerToList,
			drawingPlayer;

		// Add player to list
		addPlayerToList = function (p, data) {
			var you = p.getSocketID() === SOG.player.getSocketID();
			// Show message in chat
			if (!you) { chat.createMessage('', p.getName() + ' har gått med i spelet!'); }
			// Add player to player-list
			playersList.innerHTML += playerTmpl(p.getObject(['name', 'picture'], function () {
				return { points: p.points(), you: you, id: p.getSocketID() };
			}));
		};

		// Init chat
		chat.init({ input: chatInputField, messages: chatMessages, player: SOG.player });

		// Add current players to list
		data.players.forEach(addPlayerToList);

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

		// New points
		game.onPoints(function (guesser, drawer) {
			// Show a message in the chat
			chat.createMessage('', game.str('ScoreMessage').assign({
				gName: guesser.player.getName(),
				gPoints: guesser.points,
				dName: drawer.player.getName(),
				dPoints: drawer.points
			}));
			// Update scores
			// TODO Make nicer
			document.querySelector('#player-' + guesser.player.getSocketID() + ' .points').innerHTML = guesser.total + ' poäng';
			document.querySelector('#player-' + drawer.player.getSocketID() + ' .points').innerHTML = drawer.total + ' poäng';
		});

		// Correct word
		room.onCorrectWordGuessed(function (data) {
			// Remove old word
			if (typeof wordNode !== 'undefined') {
				gameplan.removeChild(wordNode);
				wordNode = undefined;
				gameWrapper.classList.remove('draw');
				chatInputField.disabled = false;
			}

			if (data.next && data.next.draw) {
				// Disable chat input field
				chatInputField.disabled = true;
				// Show new word
				wordNode = SOG.utils.html('div', {
					id: 'word-wrapper',
					text: '<div id="word"><span class="text">Din tur att rita</span><span class="word">' + data.next.word + '</span>',
					to: gameplan
				});
				setTimeout(function () {
					// Minimize word
					wordNode.classList.add('small');

					// Show crayons
					gameWrapper.classList.add('draw');
				}, 2000);
				// Enable drawing
				artboard.enable();
			} else {
				window.setTimeout(function () {
					chatInputField.focus(); // TODO Whats wrong?
				}, 0);
				// Disable drawing
				artboard.disable();
			}

			// Save drawing in chat
			if (data.word !== '' && artboard.getImage() !== '') {
				SOG.player.saveImage(artboard.getImage());

				chat.createMessage({
					img: artboard.getImage(),
					word: data.word,
					name: data.player.getName(),
					picture: data.player.getPicture(),
					fid: data.player.getFacebookID()
				});
			}

			// Clear the artboard
			artboard.clear();

			// Start timer
			timer.className = '';
			setTimeout(function () { timer.classList.add('min-' + (data.next.minutes || 0)); }, 2000);

			// Show who is drawing
			if (drawingPlayer) {
				artboardWrapper.removeChild(drawingPlayer);
				drawingPlayer = undefined;
			}
			if (data.next.player) {
				drawingPlayer = SOG.utils.html('div', {
					id: 'drawing-player',
					text: '<img src="' + data.next.player.getPicture() + '"><span>' + data.next.player.getName() + ' ritar.</span>',
					to: artboardWrapper
				});
			}

			// When someone leave
			room.onLeaveRoom(function (name, id) {
				playersList.removeChild(document.getElementById('player-' + id));
				chat.createMessage('', name + ' har lämnat spelet.');
			});

			// Game over!
			game.onGameOver(function (data) {
				SOG.utils.html('div', {
					id: 'game-over-wrapper',
					text: Handlebars.templates['gameover.hbs']({ players: data }),
					to: gameplan
				});
			});
		});

		// A player joins the room
		room.onPlayerJoinsRoom(addPlayerToList);

		// Panel for crayon
		SOG.browser.crayons.init({
			sizes: [].slice.call(document.querySelectorAll('#sizes a')),
			colors: [].slice.call(document.querySelectorAll('#colors a'))
		});
	};

	// Show error message
	showErrorMessage = function (message) {
		console.log('An error occured: ' + message);
	};

	// Join room
	SOG.player.join(room);

	SOG.player.onDataChanged(function (p) {
		console.log(p);
	});

	// Change room
	SOG.browser.lobby.onGameSelected(function (gid) {
		room.changeTo(gid, startGame);
		document.body.classList.add('game');
	});

	// Show error messages on error
	game.onError(function (e) {
		var p = SOG.browser.popup(game.str(e.name) || { title: e.name, message: e.message });

		if (e.name === 'DisconnectedException') {
			// Change to first page
			pageWrapper.classList.remove('hide-wrapper');
			gameWrapper.classList.add('hide-wrapper');
			// Add button when connected again
			game.onConnect(function () {
				p.addBtn('Ok, anslut igen!', 'http://skissaochgissa.se');
			});
		}
	});



	window.tt = SOG.player;
};
