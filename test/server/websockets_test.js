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
    this.gamesMock = {
      createPlayer: sinon.stub().returns(this.player),
      join: function () {},
      leave: function () {},
      json: function () {}
    };
    websockets.__set__('games', this.gamesMock);

    // Helper for testing socket.broadcast.to().emit()
    this.expectSocketEvent = function (socket) {
      var self = this;
      var beforeBroadcast = function () {
        self.broadcastMock.to = sinon.stub().returns(self.broadcastMock);
        self.broadcastMock.emit = sinon.spy();
        runWebsockets(self.socketMock).call(socket.event, socket.data);
      };

      var to = {
        broadcastTo: function (roomId, event, data) {
          beforeBroadcast();
          expect(self.broadcastMock.to).to.have.been.calledWith(roomId);
          expect(self.broadcastMock.emit).to.have.been.calledWith(event, data);
        },
        not: {
          broadcast: function (event) {
            beforeBroadcast();
            expect(self.broadcastMock.to).to.not.have.been.calledWith();
            expect(self.broadcastMock.emit).to.not.have.been.calledWith();
          }
        }
      };

      return { to: to };
    };
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
      this.player.json = sinon.stub().returns({ uuid: 123 });
      this.expectSocketEvent({ event: 'join', data: this.data })
        .to.broadcastTo(this.player.room.id, 'player left', { player: { uuid: 123 } });
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
      this.expectSocketEvent({ event: 'join', data: this.data })
        .to.broadcastTo(this.player.room.id, 'player joined', { uuid: 123 });
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

    it('should only emit to correct room', function () {
      var data = { player: { UUID: '' }, message: 'Ett chatt-meddelande' };
      this.expectSocketEvent({ event: 'chat', data: data })
        .to.broadcastTo(this.player.room.id, 'chat', data);
    });

    it('should not emit if message is undefined', function () {
      var data = { player: { UUID: '' } };
      this.expectSocketEvent({ event: 'chat', data: data }).to.not.broadcast('chat');
    });

    it('should not emit if message is an empty string', function () {
      var data = { player: { UUID: '' }, message: '' };
      this.expectSocketEvent({ event: 'chat', data: data }).to.not.broadcast('chat');
    });
  });

  describe('EVENT: disconnect', function () {

    it('should listen to "disconnect', function () {
      this.socketMock.on = sinon.spy();
      runWebsockets(this.socketMock);

      expect(this.socketMock.on).to.have.been.calledWith('disconnect');
    });

    it('should tell the other clients in the new room that a user have left the room', function () {
      this.player.json = sinon.stub().returns({ uuid: 123 });
      this.broadcastMock.emit = sinon.spy();
      runWebsockets(this.socketMock).call('disconnect');

      expect(this.broadcastMock.emit).to.have.been.calledWith('player left', { player: { uuid: 123 } });
    });

    it('should call games.leave()', function () {
      this.gamesMock.leave = sinon.spy();
      runWebsockets(this.socketMock).call('disconnect');

      expect(this.gamesMock.leave).to.have.been.calledWith(this.player);
    });

    it('should only emit to correct room', function () {
      this.player.json = sinon.stub().returns({ uuid: 123 });
      this.expectSocketEvent({ event: 'disconnect', data: this.data })
        .to.broadcastTo(this.player.room.id, 'player left', { player: { uuid: 123 } });
    });
  });
});
