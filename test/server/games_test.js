var expect = require('chai').expect;
var rewire = require('rewire');
var games = rewire('../../src/server/games');

var Player = games.__get__('Player');
var Room = games.__get__('Room');
var rooms = games.__get__('rooms');
var dict = games.__get__('dict');

describe('Games', function () {

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
            done();
          }.bind(this);

          var listenerRemove = function (e) {
            expect(e.player.uuid).to.equal(this.player.uuid);
            expect(e.room.uuid).to.equal(oldRoom.uuid);
            done();
          }.bind(this);

          games.addListener('player_added', listenerAdd);
          games.addListener('player_removed', listenerRemove);
          games.join(this.player, this.game.id);
        });

    // TODO Make the tests using mocking!
    //it('should fire "player_added"-event when player is created and joins the lobby',
    //    function (done) {
    //      var listener = function (e) {
    //        expect(e.player).to.be.ok;
    //        expect(e.room.id).to.equal('lobby');
    //        done();
    //      }.bind(this);

    //      games.addListener('player_added', listener);
    //      games.createPlayer({ });
    //    });
  });
});
