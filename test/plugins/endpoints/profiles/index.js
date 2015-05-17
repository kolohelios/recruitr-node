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
var Profile = require('../../../../lib/models/profile');

var server;

describe('GET /profiles/{profileId?}', function(){
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
  it('should get all profiles', function(done){
    server.inject({method: 'GET', url: '/profiles', credentials: {_id: 'b00000000000000000000004'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.have.length(3);
      done();
    });
  });
  // it('should get error if not properly authorized', function(done){
  //   server.inject({method: 'GET', url: '/profiles', credentials: {_id: 'b00000000000000000000004'}, payload: {name: 'Chris', gender: 'male'}}, function(response){
  //     expect(response.statusCode).to.equal(200);
  //     expect(response.result).to.have.length(3);
  //     done();
  //   });
  // });
  it('should throw an error', function(done){
    var stub = Sinon.stub(Profile, 'find').yields(new Error());
    server.inject({method: 'GET', url: '/profiles', credentials: {_id: 'b00000000000000000000004'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
