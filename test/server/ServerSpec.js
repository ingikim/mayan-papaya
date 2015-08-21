var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../../app');
var server = app.app;

var request = supertest.agent(server);

describe('routes', function() {
  describe('GET', function() {
    it('should return index.html', function(done) {
      request
        .get('/')
        .expect(200, /angular.js/, done);
    });

    it('should 404 when asked for a nonexistent file', function(done) {
      request
        .get('/arglebargle')
        .expect(404, done);
    });
  });
});
