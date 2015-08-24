var rewire = require('rewire');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var expect = chai.expect;
var websockets = rewire('../../src/server/websockets');

// socket.on
var on = (function () {
  var events = {};

  return {
    add: function (event, listener) { events[event] = listener; },
    call: function (event, data) { events[event](data); },
    clear: function () { events = {}; }
  };
}());

var runWebsockets = function (socket) {
  // Call io.on('conneciton', function (socket) { ... }) with mocked socket
  var onMock = function (event, cb) { if (event === 'connection') { cb(socket); } };
  websockets(null, function () { return { on: onMock }; });
  return on;
};

describe('Websockets', function () {

  beforeEach(function () {
    this.broadcastMock = { to: function () { return this; }, emit: function () { return this; } };
    this.socketMock = {
      id: 123,
      on: on.add,
      emit: function () {},
      broadcast: this.broadcastMock,
      leave: function () {},
      join: function () {}
    };
    // Mock games.js
    this.playerJSON = { UUID: 'player1' };
    this.player = {
      uuid: 'player1',
      room: { id: 'lobby' },
      json: function () { return this.playerJSON; }.bind(this)
    };
    this.gamesMock = { createPlayer: sinon.stub().returns(this.player), join: function () {} };
    websockets.__set__('games', this.gamesMock);
  });

  afterEach(function () {
    on.clear();
  });

  it('should start socket.io with the first param as argument', function () {
    var socket = sinon.stub().returns({ on: function () {} });
    websockets('app', socket);
    expect(socket).to.have.been.calledWith('app');
  });

  it('should listen to the connection event', function () {
    var on = sinon.spy();
    websockets(null, function () { return { on: on }; });
    expect(on).to.have.been.calledWith('connection');
  });

  it('should create a player when a user connects', function () {
    runWebsockets(this.socketMock);

    expect(this.gamesMock.createPlayer).to.have.been.calledWith(this.socketMock);
  });

  it('should join lobby when a user connect', function () {
    this.socketMock.join = sinon.spy();
    runWebsockets(this.socketMock);

    expect(this.socketMock.join).to.have.been.calledWith('lobby');
  });

  it('should send player data to the client when the user connects', function () {
    this.socketMock.emit = sinon.spy();
    runWebsockets(this.socketMock);

    expect(this.socketMock.emit).to.have.been.calledWith('player', this.playerJSON);
  });

  it('should get player data from the json-method of the player', function () {
    this.player.json = sinon.spy();
    runWebsockets(this.socketMock);

    //expect(this.player.json).to.have.been.called();
    expect(this.player.json).to.have.been.calledWith();
  });

  describe('EVENT: join', function () {

    beforeEach(function () {
      this.data = { roomId: '12345' }; 
    });

    it('should listen to "join', function () {
      this.socketMock.on = sinon.spy();
      runWebsockets(this.socketMock);

      expect(this.socketMock.on).to.have.been.calledWith('join');
    });

    it('should call games.join with the new room id', function () {
      this.gamesMock.join = sinon.spy();
      runWebsockets(this.socketMock).call('join', this.data);

      expect(this.gamesMock.join).to.have.been.calledWith(this.player, '12345');
    });

    it('should tell the old room that the player have left the room', function () {
      this.broadcastMock.to = sinon.stub().returns(this.broadcastMock);
      this.broadcastMock.emit = sinon.spy();
      runWebsockets(this.socketMock).call('join', this.data);

      expect(this.broadcastMock.to).to.have.been.calledWith(this.player.room.id);
      expect(this.broadcastMock.emit).to.have.been.calledWith('leave', { playerId: this.player.uuid });
    });

    it('should tell socket.io to leave the old room', function () {
      this.socketMock.leave = sinon.spy();
      runWebsockets(this.socketMock).call('join', this.data);

      expect(this.socketMock.leave).to.have.been.calledWith(this.player.room.id);
    });

    it('should tell socket.io to join the new room', function () {
      this.socketMock.join = sinon.spy();
      runWebsockets(this.socketMock).call('join', this.data);

      expect(this.socketMock.join).to.have.been.calledWith(this.data.roomId);
    });

    it('should tell the clients in the new room that a user have joined the room', function () {
      this.player.json = sinon.stub().returns({ uuid: 123 });
      this.broadcastMock.to = sinon.stub().returns(this.broadcastMock);
      this.broadcastMock.emit = sinon.spy();
      runWebsockets(this.socketMock).call('join', this.data);

      expect(this.broadcastMock.to).to.have.been.calledWith(this.data.roomId);
      expect(this.broadcastMock.emit).to.have.been.calledWith('player joined', { uuid: 123 });
    });

    it('should send room-json to the players client', function () {
      this.socketMock.emit = sinon.spy();
      runWebsockets(this.socketMock).call('join', this.data);

      expect(this.socketMock.emit).to.have.been.calledWith('join');
    });
  });

  describe('EVENT: chat', function () {

    it('should listen to "chat', function () {
      this.socketMock.on = sinon.spy();
      runWebsockets(this.socketMock);

      expect(this.socketMock.on).to.have.been.calledWith('chat');
    });
  });

  //it('should send a join-event when a new user connects', function () {
   // websockets(null, socketMock);
  //});
});
