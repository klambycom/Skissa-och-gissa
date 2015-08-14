var rewire = require('rewire');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var expect = chai.expect;
var websockets = rewire('../../src/server/websockets');

describe('Websockets', function () {

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
    // Mock games.js
    var gamesMock = { createPlayer: sinon.spy() };
    websockets.__set__('games', gamesMock);
    // Call io.on('conneciton', function (socket) { ... }) with mocked socket
    var socketMock = { id: 123 };
    var onMock = function (event, cb) { if (event === 'connection') { cb(socketMock); } };
    websockets(null, function () { return { on: onMock }; });

    expect(gamesMock.createPlayer).to.have.been.calledWith(socketMock);
  });

  //it('should send a join-event when a new user connects', function () {
   // websockets(null, socketMock);
  //});
});
