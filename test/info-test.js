var assert = require('assert');
var ripple = require('ripple-lib');
var testutils = require('./testutils');
var fixtures = require('./fixtures').server;
var errors = require('./fixtures').errors;

describe('get server info', function() {
  var self = this;

  //self.wss: rippled mock
  //self.app: supertest-enabled REST handler

  beforeEach(testutils.setup.bind(self));
  afterEach(testutils.teardown.bind(self));

  it('/server', function(done) {
    self.wss.once('request_server_info', function(message, conn) {
      assert.strictEqual(message.command, 'server_info');
      conn.send(fixtures.serverInfoResponse(message));
    });

    self.app
    .get('/v1/server')
    .expect(200)
    .expect(testutils.checkHeaders)
    .expect(function(res, err) {
      assert.ifError(err);
      assert.strictEqual(JSON.stringify(res.body), fixtures.RESTServerInfoResponse);
    })
    .end(done);
  });

  it('/server/connected', function(done) {
    self.wss.once('request_server_info', function(message, conn) {
      assert(false, 'Should not request server info');
    });

    self.app
    .get('/v1/server/connected')
    .expect(200)
    .expect(testutils.checkHeaders)
    .expect(function(res, err) {
      assert.ifError(err);
      assert.strictEqual(JSON.stringify(res.body), fixtures.RESTServerConnectedResponse);
    })
    .end(done);
  });
});
