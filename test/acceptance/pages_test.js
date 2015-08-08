process.env.NODE_ENV = 'test';

var mongoose = require('mongoose');
var request = require('supertest');
var app = require('../../server.js');
var cheerio = require('cheerio');

var clearDB = function () {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove();
  }
};



// Helper functions

// TODO Create real expect().???() functions instead of helpers.
// E.g. expect('/').toReturnStatusCode(200)

var expectStatusCode = function (url, statusCode) {
  return function (done) {
    request(app)
      .get(url)
      .expect(statusCode)
      .end(function (err) {
        expect(err).toBeNull();
        done();
      });
  };
};

var expectTitleToContain = function (url, title) {
  return function (done) {
    request(app)
      .get(url)
      .end(function (err, res) {
        $ = cheerio.load(res.text);
        expect($('title').text()).toMatch(title);
        done();
      });
  };
};

describe('ACCEPTANCE: Pages-routes', function () {
  beforeEach(function () {
    clearDB();
  });

  afterEach(function () {
    mongoose.disconnect();
  });

  describe('/', function () {

    it('should return status code 200', expectStatusCode('/', 200));

    it('should have the text "Skissa och gissa" in the title',
        expectTitleToContain('/', 'Skissa och gissa'));

    it('should have a Facebook login link', function (done) {
      request(app)
        .get('/')
        .end(function (err, res) {
          $ = cheerio.load(res.text);
          expect($('#login a').text()).toMatch('Logga in med Facebook');
          expect($('#login a').attr('href')).toMatch('/login/facebook');
          done();
        });
    });
  });

  describe('/settings', function () {

    it('should return status code 200', expectStatusCode('/settings', 200));

    it('should have the text "Skissa och gissa" in the title',
        expectTitleToContain('/settings', 'Skissa och gissa'));

    it('should have link to front page', function (done) {
      request(app)
        .get('/settings')
        .end(function (err, res) {
          $ = cheerio.load(res.text);
          expect($('header a').text()).toMatch('Skissa och gissa');
          expect($('header a').attr('href')).toMatch('/');
          done();
        });
    });

    it('should have the text "Skissa och gissa" in the title', function (done) {
      request(app)
        .get('/settings')
        .end(function (err, res) {
          $ = cheerio.load(res.text);
          expect($('title').text()).toMatch('Skissa och gissa');
          done();
        });
    });
  });

  describe('/game', function () {

    it('should return status code 200', expectStatusCode('/game', 200));

    it('should have the text "Skissa och gissa" in the title',
        expectTitleToContain('/game', 'Skissa och gissa'));
  });
});
