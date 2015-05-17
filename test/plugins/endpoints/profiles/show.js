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
var assert = Chai.assert;
var it = lab.test;
var before = lab.before;
var after = lab.after;
var beforeEach = lab.beforeEach;
var Profile = require('../../../../lib/models/profile');
var User = require('../../../../lib/models/user');

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
  it('should get one specific profile and info', function(done){
    server.inject({method: 'GET', url: '/profiles/a00000000000000000000002', credentials: {_id: 'b00000000000000000000004'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result._id.toString()).to.equal('a00000000000000000000002');
      done();
    });
  });
  it('should error on non-existent profile', function(done){
    server.inject({method: 'GET', url: '/profiles/c00110000980005342000017', credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  it('should get one specific profile and restricted info', function(done){
    server.inject({method: 'GET', url: '/profiles/a00000000000000000000002', credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result._id.toString()).to.equal('a00000000000000000000002');
      expect(response.result.bio).to.not.be.ok;
      expect(response.result.photo).to.not.be.ok;
      expect(response.result.lastName).to.not.be.ok;
      assert.notOk(response.result.contact[0]);
      assert.notOk(response.result.social[0]);
      done();
    });
  });
  it('should throw an error on Profile.findOne', function(done){
    var stub = Sinon.stub(Profile, 'findOne').yields(new Error());
    server.inject({method: 'GET', url: '/profiles/a00000000000000000000002', credentials: {_id: 'b00000000000000000000004'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
  it('should throw an error on Profile.findById', function(done){
    var stub = Sinon.stub(User, 'findById').yields(new Error());
    server.inject({method: 'GET', url: '/profiles/a00000000000000000000002', credentials: {_id: 'b00000000000000000000004'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
