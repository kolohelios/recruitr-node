/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');
var User = require('../../../../lib/models/user');
var Sinon = require('sinon');


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

describe('DELETE /users/{userId}', function(){
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
  it('should delete a new user', function(done){
    server.inject({method: 'DELETE', url: '/users/b00000000000000000000001', credentials: {_id: 'b00000000000000000000004'}},function(response){
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
  it('should return an error because user does not exist', function(done){
    server.inject({method: 'DELETE', url: '/users/b00000000000000000000009', credentials: {_id: 'b00000000000000000000004'}},function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  it('should return an error if user to delete is not found', function(done){
    var stub = Sinon.stub(User, 'findOne').yields(new Error());
    server.inject({method: 'DELETE', url: '/users/b00000000000000000000002', credentials: {_id: 'b00000000000000000000004'}},function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
  it('should return an error if user is not admin', function(done){
    server.inject({method: 'DELETE', url: '/users/b00000000000000000000002', credentials: {_id: 'b00000000000000000000003'}},function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  // it('should return null after user is removed', function(done){
  //   var stub = Sinon.stub(User, 'findOne').onCall(1).yields(new Error());
  //   server.inject({method: 'DELETE', url: '/users/b00000000000000000000003', credentials: {_id: 'b00000000000000000000004'}},function(response){
  //     expect(response.statusCode).to.equal(400);
  //     stub.restore();
  //     done();
  //   });
  // });
});
