var expect = require('chai').expect;
var rewire = require('rewire');
var games = rewire('../../src/server/games');

var Player = games.__get__('Player');
var Room = games.__get__('Room');

describe('Games', function () {

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

    it('should create a player and save the websocket', function () {
      expect(this.player.websocket).to.deep.equal({ id: 123 });
    });

    it('should create a player with a unique uuid', function () {
      expect(this.player.uuid).to.be.a('string');
    });

    it('should create a player and join lobby', function () {
      expect(this.player.room).to.be.an.instanceof(Room);
      expect(this.player.room.id).to.equal('lobby');
    });
  });

  describe('#join', function () {

    it('should be defined', function () {
      expect(games.join).to.be.a('function');
    });
  });

  describe('#leave', function () {

    it('should be defined', function () {
      expect(games.leave).to.be.a('function');
    });
  });

  describe('#players', function () {

    it('should be defined', function () {
      expect(games.players).to.be.a('function');
    });
  });

  describe('#all', function () {

    it('should be defined', function () {
      expect(games.all).to.be.a('function');
    });
  });

  describe('#get', function () {

    it('should be defined', function () {
      expect(games.get).to.be.a('function');
    });
  });

  describe('#on', function () {

    it('should be defined', function () {
      expect(games.on).to.be.a('function');
    });
  });
});
