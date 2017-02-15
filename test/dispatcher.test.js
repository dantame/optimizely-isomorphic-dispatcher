var expect = require('chai').expect;
var nock = require('nock');
var dispatcher = require('../dispatcher.js');
var NOCK_URL = 'http://nocked-url.com';
var PARAMS = { foo: 'bar', baz: 'qux' };
var RESPONSE = 'ok';

describe('Isomorphic Event Dispatcher', function() {
  describe('GET', function() {
    afterEach(function() {
      nock.cleanAll();
    });

    it('should dispatch a get request', function(done) {
      var nockedRequest = nock(NOCK_URL)
      .get('/')
      .query(PARAMS)
      .reply(200, RESPONSE);

      var eventObj = {
        url: NOCK_URL,
        params: PARAMS
      };

      dispatcher.dispatchEvent(eventObj)
      .then(function(res) {
        expect(res.text).to.equal(RESPONSE);
        expect(nockedRequest.isDone());
        done();
      });
    });

    it('should pass errors back as promises', function(done) {
      var nockedRequest = nock(NOCK_URL)
      .get('/')
      .query(PARAMS)
      .reply(500, RESPONSE);

      var eventObj = {
        url: NOCK_URL,
        params: PARAMS
      };

      dispatcher.dispatchEvent(eventObj)
      .catch(function(err) {
        expect(err.status).to.equal(500);
        expect(err.response.text).to.equal(RESPONSE)
        done();
      });
    });
  });



  describe('POST', function() {
    afterEach(function() {
      nock.cleanAll();
    });

    it('should dispatch a post request', function(done) {
      var nockedRequest = nock(NOCK_URL)
      .post('/', PARAMS)
      .reply(200, RESPONSE);

      var eventObj = {
        url: NOCK_URL,
        params: PARAMS,
        httpVerb: 'POST'
      };

      dispatcher.dispatchEvent(eventObj)
      .then(function(res) {
        expect(res.text).to.equal(RESPONSE);
        expect(nockedRequest.isDone());
        done();
      });
    });

    it('should pass errors back as promises', function(done) {
      var nockedRequest = nock(NOCK_URL)
      .post('/', PARAMS)
      .reply(500, RESPONSE);

      var eventObj = {
        url: NOCK_URL,
        params: PARAMS,
        httpVerb: 'POST'
      };

      dispatcher.dispatchEvent(eventObj)
      .catch(function(err) {
        expect(err.status).to.equal(500);
        expect(err.response.text).to.equal(RESPONSE)
        done();
      });
    });
  });
});
