/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');
var CP = require('child_process');
var Path = require('path');
var Sinon = require('sinon');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;
var beforeEach = lab.beforeEach;
var User = require('../../../../lib/models/user');

var server;

describe('GET /users/{userId}', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });
  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('/')[3];
    CP.execFile(Path.join(__dirname, '../../../scripts/clean-db.sh'), [db], {cwd: Path.join(__dirname, '../../../scripts')}, function(){
      done();
    });
  });
  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });
  it('should get one user', function(done){
    server.inject({method: 'GET', url: '/users/b00000000000000000000002', credentials: {_id: 'b00000000000000000000004'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result._id.toString()).to.equal('b00000000000000000000002');
      done();
    });
  });
  it('should not get users for non admin', function(done){
    server.inject({method: 'GET', url: '/users/b00000000000000000000002', credentials: {_id: 'b00000000000000000000003'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  it('should return 400 on findOne', function(done){
    var stub = Sinon.stub(User, 'findOne').yields(new Error());
    server.inject({method: 'GET', url: '/users/b00000000000000000000002', credentials: {_id: 'b00000000000000000000003'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
  it('should return 400 on findById', function(done){
    var stub = Sinon.stub(User, 'findById').yields(new Error());
    server.inject({method: 'GET', url: '/users/b00000000000000000000002', credentials: {_id: 'b00000000000000000000003'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
  it('should return 400 if no user with matching id found', function(done){
    server.inject({method: 'GET', url: '/users/q00000000000000000000002', credentials: {_id: 'b00000000000000000000003'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
});
