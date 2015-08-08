process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var request = require('supertest');
var app = require('../../server.js');

var clearDB = function () {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove();
  }
};

describe('ACCEPTANCE: Pages', function () {
  beforeEach(function () {
    clearDB();
  });

  afterEach(function () {
    mongoose.disconnect();
  });

  it('should return status code 200 given the url /', function (done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function (err, res) {
        expect(err).toBeNull();
        //expect(res.text).toEqual('hej'); TODO Parse HTML!
        done();
      });
  });
});
