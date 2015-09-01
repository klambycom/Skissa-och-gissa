var expect = require('chai').expect;

var mongoose = require('mongoose');
var db = require('../../src/server/db');

var haveField = function (field, type) {
  expect(field).to.exist;
  expect(field.instance).to.equal(type);
};

var haveValidator = function (field, type, message) {
  var validator = field.validators.reduce(function (acc, x) {
    if (x.type == type) { acc = x; }
    return acc;
  }, {});

  if (Object.keys(validator).length === 0) {
    fail('Expected validator for ' + type);
  } else if (typeof message !== 'undefined') {
    expect(validator.message).to.equal(message);
  }
};

describe('DB', function () {

  beforeEach(function () {
    delete mongoose.connection.models['Image'];
    delete mongoose.connection.models['User'];
  });

  it('should have schema for Image', function () {
    expect(mongoose.modelSchemas.Image).to.exist;
  });

  it('should have schema for User', function () {
    expect(mongoose.modelSchemas.User).to.exist;
  });

  describe('Image', function () {
    
    describe('schema', function () {
      var Image;

      beforeEach(function () {
        Image = mongoose.modelSchemas.Image.paths;
      });

      it('should have a word-field', function () {
        haveField(Image.word, 'String');
        //console.log(Image.word);
      });

      it('should require a word', function () {
        haveValidator(Image.word, 'required');
      });

      it('should have a url-field', function () {
        haveField(Image.url, 'String');
      });

      it('should require an url', function () {
        haveValidator(Image.url, 'required');
      });

      it('should have a player-field', function () {
        haveField(Image.player, 'String');
      });

      it('should have a created_at-field', function () {
        haveField(Image.created_at, 'Date');
      });
    });

    describe('#latest', function () {
      
      it('should be defined', function () {
        expect(db.Image.latest).to.exist;
      });
    });

    describe('#findImage', function () {
      
      it('should be defined', function () {
        expect(db.Image.findImage).to.exist;
      });
    });
  });
});
