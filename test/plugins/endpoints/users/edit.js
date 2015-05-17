'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var CP = require('child_process');
var Path = require('path');
var Sinon = require('sinon');
var Server = require('../../../../lib/server');
var User = require('../../../../lib/models/user');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var beforeEach = lab.beforeEach;
var before = lab.before;
var after = lab.after;
var server;

describe('PUT /users/{userId}', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });
  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('/')[3];
    CP.execFile(Path.join(__dirname, '../../../../scripts/clean-db.sh'), [db], {cwd: Path.join(__dirname, '../../../../scripts')}, function(){
      done();
    });
  });
  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });
  it('should edit an existing profile', function(done){
    server.inject({method: 'PUT', url: '/users/b00000000000000000000002', credentials: {_id: 'b00000000000000000000004'}, payload: {email: 'bob@bob.com', password: 'abc', role: 5, createdAt: 1431541042952, firstName: 'jon', lastName: 'smith', company: 'aol'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.lastName).to.equal('smith');
      done();
    });
  });
  it('should error out on Joi validation', function(done){
    server.inject({method: 'PUT', url: '/users/b00000000000000000000002', credentials: {_id: 'b00000000000000000000004'}, payload: {password: 'abc', role: 5, createdAt: 1431541042952, firstName: 'jon', lastName: 'smith', company: 'aol'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  it('should throw db error for lack of auth', function(done){
    server.inject({method: 'PUT', url: '/users/b00000000000000000000002', credentials: {_id: 'b00000000000000000000001'}, payload: {email: 'bob@bob.com', password: 'abc', role: 5, createdAt: 1431541042952, firstName: 'jon', lastName: 'smith', company: 'aol'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  it('should throw db error for lack of validUser', function(done){
    server.inject({method: 'PUT', url: '/users/b00005000000000008800002', credentials: {_id: 'b00000000000000000000004'}, payload: {email: 'bob@bob.com', password: 'abc', role: 5, createdAt: 1431541042952, firstName: 'jon', lastName: 'smith', company: 'aol'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  it('should throw db error on findById', function(done){
    var stub = Sinon.stub(User, 'findById').yields(new Error());
    server.inject({method: 'PUT', url: '/users/b00000000000000000000002', credentials: {_id: 'b00000000000000000000004'}, payload: {email: 'bob@bob.com', password: 'abc', role: 5, createdAt: 1431541042952, firstName: 'jon', lastName: 'smith', company: 'aol'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
  it('should throw db error on findOne', function(done){
    var stub = Sinon.stub(User, 'findOne').yields(new Error());
    server.inject({method: 'PUT', url: '/users/b00000000000000000000002', credentials: {_id: 'b00000000000000000000004'}, payload: {email: 'bob@bob.com', password: 'abc', role: 5, createdAt: 1431541042952, firstName: 'jon', lastName: 'smith', company: 'aol'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
