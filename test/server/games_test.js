var expect = require('chai').expect;
var games = require('../../src/server/games');

describe('Games', function () {

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
