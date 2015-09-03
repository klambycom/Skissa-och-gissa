var expect = require('chai').expect;
var rewire = require('rewire');
var games = rewire('../../src/server/games');

var Player = games.__get__('Player');
var Room = games.__get__('Room');
var rooms = games.__get__('rooms');
var dict = games.__get__('dict');
var events = games.__get__('events');

describe('Games', function () {

  describe('ROOMS', function () {

    it('should create a lobby', function () {
      expect(rooms.lobby).to.not.be.undefined;
      expect(rooms.lobby).to.be.an.instanceof(Room);
    });

    it('should create a game of each type', function () {
      var roomTypes = Object.keys(rooms).map(function (x) { return rooms[x].type; });
      expect(roomTypes).to.contain('lobby');

      Object.keys(dict).forEach(function (x) {
        expect(roomTypes).to.contain(x);
      });
    });

    it('should save the rules when creating games', function () {
      var game = rooms[Object.keys(rooms)[1]];
      var rules = dict[Object.keys(dict)[0]];

      expect(game.type).to.equal(Object.keys(dict)[0]);
      expect(game.time).to.equal(rules.time);
      expect(game.rounds).to.equal(rules.rounds);
      expect(game.maxPlayers).to.equal(rules.maxPlayers);
      expect(game.points.max).to.equal(rules.points.max);
      expect(game.points.one_line).to.equal(rules.points.one_line);
      expect(game.points.many_lines).to.equal(rules.points.many_lines);
      expect(game.words).to.equal(rules.words);
    });
  });

  describe('PLAYER', function () {
    var player;

    beforeEach(function () { player = games.createPlayer({}); });

    it('should have a #json-method', function () {
      expect(player.json).to.be.ok;
    });

    it('should be able to get JSON of the player', function () {
      expect(player.json()).to.include.keys(['UUID', 'name', 'fbId', 'points']);
    });
  });

  describe('#json', function () {

    it('should be defined', function () {
      expect(games.json).to.be.a('function');
    });

    it('should return an array', function () {
      expect(games.json()).to.be.an('array');
    });

    it('should return the rooms as JSON', function () {
      var game = rooms[Object.keys(rooms)[1]];

      games.join(games.createPlayer({ }), game.id);
      games.join(games.createPlayer({ }), game.id);
      games.join(games.createPlayer({ }), game.id);

      expect(games.json()[0]).to.contain({
        uuid: game.id,
        type: game.type,
        time: game.time,
        rounds: game.rounds,
        nrOfPlayers: Object.keys(game.players).length,
        maxPlayers: game.maxPlayers,
        points: game.points,
        name: dict[game.type].name,
        description: dict[game.type].description,
        difficulty: dict[game.type].difficulty
      });
    });

    it('should return friends in room');

    it('should return players in room', function () {
      var json = games.json()[0];
      var game = rooms[Object.keys(rooms)[1]];
      var player = games.createPlayer({ });

      games.join(player, game.id);

      expect(json.players[0]).to.include.keys([ 'UUID', 'name', 'fbId', 'points' ]);
    });

    it('should not contain the lobby', function () {
      expect(games.json().map(function (x) {return x.uuid; })).to.not.include('lobby');
    });

    it('should return all rooms/games', function () {
      var gameUuids = games.json().map(function (x) { return x.uuid; });

      Object
        .keys(rooms)
        .filter(function (x) { return x !== 'lobby'; })
        .forEach(function (x, i) {
          expect(x).to.equal(gameUuids[i], 'Room at position nr ' + i);
        });
    });
  });

  describe('#createPlayer', function () {

    beforeEach(function () {
      this.player = games.createPlayer({ id: 123 });
    });

    it('should be defined', function () {
      expect(games.createPlayer).to.be.a('function');
    });

    it('should create a player', function () {
      expect(this.player).to.be.an.instanceof(Player);
    });

    it('should save the websocket', function () {
      expect(this.player.websocket).to.deep.equal({ id: 123 });
    });

    it('should create a unique uuid', function () {
      expect(this.player.uuid).to.be.a('string');
    });

    it('should join lobby', function () {
      expect(this.player.room).to.be.an.instanceof(Room);
      expect(this.player.room.id).to.equal('lobby');
    });

    it('should add player to the playerlist of lobby', function () {
      expect(this.player.room.players[this.player.uuid]).to.contain(this.player);
    });
  });

  describe('#join', function () {

    beforeEach(function () {
      this.player = games.createPlayer({ });
      this.lobby = rooms[Object.keys(rooms)[0]];
      this.game = rooms[Object.keys(rooms)[1]];
      games.join(this.player, this.game.id);
    });

    it('should be defined', function () {
      expect(games.join).to.be.a('function');
    });

    it('should change the players room', function () {
      expect(this.player.room).to.equal(this.game);
    });

    it('should add the player to the rooms players list', function () {
      expect(Object.keys(this.game.players)).to.contain(this.player.uuid);
    });

    it('should remove the player from the old rooms players list', function () {
      expect(Object.keys(this.lobby.players)).to.not.contain(this.player.uuid);
    });
  });

  describe('#leave', function () {

    beforeEach(function () {
      this.player = games.createPlayer({ });
      this.lobby = rooms[Object.keys(rooms)[0]];
    });

    it('should be defined', function () {
      expect(games.leave).to.be.a('function');
    });

    it('should remove player', function () {
      games.leave(this.player);
      expect(Object.keys(this.lobby.players)).to.not.contain(this.player.uuid);
    });
  });

  describe('#players', function () {

    beforeEach(function () {
      this.player1 = games.createPlayer({ });
      this.player2 = games.createPlayer({ });
      this.game = rooms[Object.keys(rooms)[2]];
    });

    it('should be defined', function () {
      expect(games.players).to.be.a('function');
    });

    it('should return empty array if room is empty', function () {
      expect(games.players(this.game.id)).to.deep.equal([]);
    });

    it('should return array with all players in the room', function () {
      games.join(this.player1, this.game.id);
      games.join(this.player2, this.game.id);
      expect(games.players(this.game.id)).to.include(this.player1);
      expect(games.players(this.game.id)).to.include(this.player2);
    });
  });

  describe('#get', function () {

    beforeEach(function () {
      this.game = rooms[Object.keys(rooms)[2]];
    });

    it('should be defined', function () {
      expect(games.get).to.be.a('function');
    });

    it('should return correct room', function () {
      expect(games.get(this.game.id)).to.equal(this.game);
    });

    it('should throw exception if room is not found', function () {
      var exception;
      try {
        games.get('invalid');
      } catch (e) {
        exception = e;
      }
      expect(exception).to.equal('Room not found');
    });
  });

  describe('#addListener', function () {
    // TODO Make the tests using mocking!

    beforeEach(function () {
      this.player = games.createPlayer({ });
      this.game = rooms[Object.keys(rooms)[1]];
    });

    it('should be defined', function () {
      expect(games.addListener).to.be.a('function');
    });

    it('should not throw exception if event is valid', function () {
      games.addListener('room_created', function () {});
      games.addListener('room_removed', function () {});
      games.addListener('player_added', function () {});
      games.addListener('player_removed', function () {});
      games.addListener('new_room_image', function () {});
    });

    it('should throw exception if event is invalid', function () {
      var exception;
      try {
        games.addListener('rum_skapat', function () {});
      } catch (e) {
        exception = e;
      }
      expect(exception).to.equal('Invalid event');
    });

    it('should fire "player_removed"-event when player disconnects', function (done) {
      var listener = function (e) {
        expect(e.player).to.equal(this.player);
        expect(e.room).to.equal(this.player.room);
        events.removeListener('player_removed', listener);
        done();
      }.bind(this);

      games.addListener('player_removed', listener);
      games.leave(this.player);
    });

    it('should fire "player_removed"- and "player_added"-event when player joins a room',
        function (done) {
          var oldRoom = this.player.room;

          var listenerAdd = function (e) {
            expect(e.player).to.equal(this.player);
            expect(e.room).to.equal(this.game);
            events.removeListener('player_added', listenerAdd);
            done();
          }.bind(this);

          var listenerRemove = function (e) {
            expect(e.player.uuid).to.equal(this.player.uuid);
            expect(e.room.uuid).to.equal(oldRoom.uuid);
            events.removeListener('player_removed', listenerRemove);
            done();
          }.bind(this);

          games.addListener('player_added', listenerAdd);
          games.addListener('player_removed', listenerRemove);
          games.join(this.player, this.game.id);
        });

    it('should fire "player_added"-event when player is created and joins the lobby',
        function (done) {
          var listener = function (e) {
            expect(e.player).to.be.ok;
            expect(e.room.id).to.equal('lobby');
            events.removeListener('player_added', listener);
            done();
          }.bind(this);

          games.addListener('player_added', listener);
          games.createPlayer({ });
        });
  });

  describe('#canJoinRoom', function () {

    it('should be defined', function () {
      expect(games.canJoinRoom).to.be.a('function');
    });

    it('should return false if room is not found', function () {
      expect(games.canJoinRoom('invalidId')).to.be.false;
    });

    it('should return true if room is found', function () {
      var roomId = Object.keys(rooms)[1];
      expect(games.canJoinRoom(roomId)).to.be.true;
    });
  });
});
