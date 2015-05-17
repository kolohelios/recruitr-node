/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');
var Sinon = require('sinon');
var User = require('../../../../lib/models/user');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;
var CP = require('child_process');
var Path = require('path');
var beforeEach = lab.beforeEach;

var server;

describe('PUT /users', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });
  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('/')[3];
    CP.execFile(Path.join(__dirname, '../../../../scripts/clean-db.sh'), [db], {cwd: Path.join(__dirname, '../../../../scripts')}, function(){
      done();
    });
  });
  it('should edit an existing user', function(done){
    server.inject({method: 'PUT', url: '/users/b00000000000000000000003', credentials: {_id: 'b00000000000000000000004'}, payload: {firstName: 'Tiger', lastName: 'Woods', email: 'andrewawesome@test.com', company: 'Golf clubs Plus', password: '3214', role: 10, createdAt: 1431815526141}}, function(response){
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
  it('should cause a db error', function(done){
    var stub = Sinon.stub(User, 'findOne').yields(new Error());
    server.inject({method: 'PUT', url: '/users/b00000000000000000000003', credentials: {_id: 'b00000000000000000000004'}, payload: {email: 'andrewawesome@test.com', password: '3214', role: 10, createdAt: 1431815526141}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
  it('should cause a db error', function(done){
    var stub = Sinon.stub(User.prototype, 'save').yields(new Error());
    server.inject({method: 'PUT', url: '/users/b00000000000000000000003', credentials: {_id: 'b00000000000000000000004'}, payload: {email: 'andrewawesome@test.com', password: '3214', role: 0, createdAt: 1431815526141}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
