/*jslint node: true, es5: true */
'use strict';

/**
 * @namespace server
 * @class room
 * @static
 */

require('../utils/functional');

var sugar = require('sugar'),
    Player = require('./Player').Player,
    games = {},
    game = {},
    filter = function (fn) { return function (a) { return a.filter(fn); }; },
    saveOld = function (r) {
      var rr = games[r];
      rr.old = { player: rr.players[rr.drawing], word: rr.word };
    };

var ImageModel = require('../../src/server/db.js').image;

var fs = require('fs'),
    getDictionary = function (type) {
      return JSON.parse(fs.readFileSync('./src/dictionary.json'))[type];
    };

/**
 * @method create
 * @param type {string|array} Type of game. Must be a valid name from
 *                            dictionary.json. Or an array of games.
 * @return Returns id.
 */
game.create = function (type) {
  var id = Number.random(99) + '-' + Date.now() + '-' + Number.random(99),
  name = (Array.isArray(type)) ? type.pop() : type;

  games[id] = {
    id: id,
    type: name,
    time: getDictionary(name).time,
    players: {},
    queue: [],
    word: '',
    words: getDictionary(name).words,
    canvas: [],
    drawing: undefined,
    image: 'placeholder.png',
    rounds: 0,
    maxPlayers: getDictionary(name).maxPlayers,
    totalRounds: getDictionary(name).rounds,
    old: {
      player: undefined,
      word: ''
    }
  };

  if (Array.isArray(type) && type.length > 0) { game.create(type); }

  return id;
};

game.delete = function (r) {
  var deleted = games[r];
  delete games[r];
  return deleted;
};

game.roundsLeft = function (r) { return games[r].totalRounds - games[r].rounds; };

game.notFull = function (r) { return Object.size(games[r].players) < games[r].maxPlayers; };

game.getData = function (r) {
  return {
    id: games[r].id,
    type: games[r].type,
    image: games[r].image,
    players: Object.keys(games[r].players).map(function (p) {
      return {
        name: games[r].players[p].getName(),
        picture: games[r].players[p].getPicture(),
        facebook: games[r].players[p].getFacebookID()
      };
    }),
    nrOfPlayers: Object.keys(games[r].players).length,
    roundsLeft: game.roundsLeft(r),
    description: getDictionary(games[r].type).description,
    difficulty: getDictionary(games[r].type).difficulty,
    name: getDictionary(games[r].type).name
  };
};

game.filterNotDone = filter(function (g) { return game.roundsLeft(g) > 2; });

game.filterNotFull = filter(game.notFull);

game.availableIds = game.filterNotDone.compose(game.filterNotFull, Object.keys);

game.available = function () { return game.availableIds(games).map(game.getData); };

game.saveImage = function (r, file, cb) {
  var rr = games[r];

  if (rr.old.player && rr.old.player.getFacebookID()) {
    new ImageModel({ player: rr.old.player.getFacebookID(), url: file, word: rr.old.word }).save(function (err, data) {
      data.player_name = rr.old.player.getFullName();
      data.player_pic = rr.old.player.getPicture();
      cb(err, data);
    });
  }

  rr.image = file;
};

game.canvas = function (r, p) {
  // Empty canvas
  if (p === 0) {
    games[r].canvas = [];
    return [];
  }

  // Return all points
  if (p === undefined) {
    return games[r].canvas;
  }

  // Add one point and return it
  games[r].canvas.push(p);
  return p;
};

game.nrOfSameType = function (type) {
  var find = function (g) { return games[g].type === type; };
  return game.availableIds(games).filter(find).length;
};

/**
 * @method get
 * @param id {string} The games id.
 * @return Returns the game.
 */
game.get = function (id) { return games[id]; };

/**
 * @method all
 * @return Returns all games.
 */
game.all = function () { return games; };

/**
 * @method addPlayer
 * @param player {Player}
 * @param gameID {string}
 * @return Returns this. TODO Why?
 */
game.addPlayer = function (player, r) {
  // Get game data
  var data = games[r];
  // Throw error if game do not exists
  if (typeof data === 'undefined') {
    throw { name: 'GameNotFoundException', message: 'Can\'t add player since the game is not found.' };
  } else if (typeof player === 'undefined') {
    throw { name: 'PlayerNotFoundException', message: 'Can\'t add non-existing player to the game.' };
  } else if (Object.size(data.players) > 8) {
    throw { name: 'GameIsFullException', message: 'Can\'t add player since the game is full.' };
  }
  // Add player to game
  //data.players[player.getSocketID()] = {
  //	facebook: player.getFacebookID(),
  //	picture: player.getPicture(),
  //	name: player.getFullName()
  //};
  data.players[player.getSocketID()] = player;
  // Add player to queue
  data.queue.push(player.getSocketID());
  // Save
  games[r] = data;

  return this;
};

/**
 * @method players
 * @param roomId {string}
 * @return Return players in game.
 */
game.players = function (r) {
  if (typeof games[r] === 'undefined') {
    throw { name: 'GameNotFoundException', message: 'Can\'t get players since the game is not found.' };
  }

  return Object.keys(games[r].players).map(function (p) { return games[r].players[p].getAllData(); });
};

game.playersNameAndScore = function (r) {
  if (typeof games[r] === 'undefined') {
    throw { name: 'GameNotFoundException', message: 'Can\'t get players since the game is not found.' };
  }

  return Object.keys(games[r].players).map(function (p) {
    return {
      name: games[r].players[p].getName(),
      picture: games[r].players[p].getPicture(),
      score: games[r].players[p].points()
    };
  });
};

/**
 * @method removePlayer
 * @param player {Player}
 * @param roomId {string}
 * @return Returns number of players left in the game.
 */
game.removePlayer = function (player, r) {
  if (!(games[r] && games[r].players[player.getSocketID()])) { return 0; }

  // Remove player form game
  delete games[r].players[player.getSocketID()];
  // Remove player from queue
  games[r].queue.remove(player.getSocketID());

  return Object.size(games[r].players);
};

/**
 * @method change
 * @param player {Player}
 * @param fromRoomId {string}
 * @param toRoomId {string}
 */
game.change = function (player, from, to) {
  game.removePlayer(player, from);
  game.addPlayer(player, to);
};

/**
 * @method playerIsNext
 * @param player {Player}
 * @param roomId {string}
 * @return Returns true if its players turn to draw.
 */
game.playerIsNext = function (player, r) {
  saveOld(r);

  var data = games[r], // Get room data
  next = data.queue.shift(); // Get next player
  // Put player last
  data.queue.push(next);
  // Save
  games[r] = data;
  // Save drawing player
  games[r].drawing = next;
  // Remove undefined
  games[r].queue = games[r].queue.filter(function (p) { return p !== undefined; });

  games[r].rounds += 1;

  return next === player.getSocketID();
};

/**
 * @method nextPlayer
 * @param roomId {string}
 * @return Returns the next player in the queue.
 */
game.nextPlayer = function (r) {
  saveOld(r);

  var data = games[r], // Get room data
  next = data.queue.shift(); // Get next player
  // Put player last
  data.queue.push(next);
  // Save
  games[r] = data;
  // Save drawing player
  games[r].drawing = next;
  // Remove undefined
  games[r].queue = games[r].queue.filter(function (p) { return p !== undefined; });

  games[r].rounds += 1;

  return games[r].players[next];
};

game.getPlayerDrawing = function (r) {
  return games[r].players[games[r].drawing];
};

/**
 * @method playersTurn
 * @param player {Player}
 * @param roomId {string}
 * @return Returns true if its the players turn to draw.
 */
game.playersTurn = function (p, r) {
  return games[r].drawing === p.getSocketID();
};

/**
 * @method setWord
 * @param roomId {string}
 * @param word {string}
 * @return Returns the word.
 */
game.setWord = function (room, word) {
  games[room].word = word;
  return word;
};

/**
 * @method getWord
 * @param roomId {string}
 * @return Returns the word.
 */
game.getWord = function (room) {
  return games[room].word;
};

/**
 * @method randomWord
 * @param roomId {string}
 * @return Returns a random word.
 */
game.randomWord = function (r) {
  // A random word
  games[r].word = games[r].words.sample();
  // Remove word from words-array
  games[r].words = games[r].words.remove(games[r].word);

  return games[r].word;
};

exports.game = game;
