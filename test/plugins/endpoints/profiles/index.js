/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');
var CP = require('child_process');
var Path = require('path');
// var Sinon = require('sinon');
var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;
var beforeEach = lab.beforeEach;
// var Profile = require('../../../../lib/models/profile');

var server;

describe('GET /profiles/{profileNum}', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });
  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('/')[3];
    CP.execFile(Path.join(__dirname, '../../../../scripts/clean-db.sh'), [db], {cwd: Path.join(__dirname, '../../../scripts')}, function(){
      done();
    });
  });
  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });
  it('should retrieve a query string', function(done){
    server.inject({method: 'GET', url: '/profiles?page=2&skill=Node', credentials: {_id: 'b00000000000000000000004'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.profiles).to.have.length(2);
      done();
    });
  });
  // something wrong with below
  it('should retrieve one page of profiles', function(done){
    server.inject({method: 'GET', url: '/profiles?page=1', credentials: {_id: 'b00000000000000000000004'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.profiles).to.have.length(10);
      done();
    });
  });
  it('should retrieve base on multiple skills', function(done){
    server.inject({method: 'GET', url: '/profiles?page=1&skill=Joi&skill=Node', credentials: {_id: 'b00000000000000000000004'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.profiles).to.have.length(1);
      expect(response.result.profiles.length).to.have.equal(1);
      expect(response.result.profiles[0].skills[0]).to.equal('Joi');
      done();
    });
  });
  it('should retrieve any of the specified search criteria', function(done){
    server.inject({method: 'GET', url: '/profiles?page=1&skill=Joi', credentials: {_id: 'b00000000000000000000004'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.profiles).to.have.length(1);
      expect(response.result.profiles.length).to.have.equal(1);
      expect(response.result.profiles[0].skills[0]).to.equal('Joi');
      done();
    });
  });
  it('should return array of length 10', function(done){
    server.inject({method: 'GET', url: '/profiles?page=1&locationPref=San%20Francisco%20CA', credentials: {_id: 'b00000000000000000000004'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.profiles).to.have.length(3);
      done();
    });
  });
  // it('should return an error 400 for finding with a query', function(done){
  //   var stub = Sinon.stub(Profile, 'find').yields(new Error());
  //   server.inject({method: 'GET', url: '/profiles?page=1&locationPref=San%20Francisco%20CA', credentials: {_id: 'b00000000000000000000004'}}, function(response){
  //     expect(response.statusCode).to.equal(400);
  //     stub.restore();
  //     done();
  //   });
  // });
  // it('should return an error 400 for find with only page number', function(done){
  //   var stub = Sinon.stub(Profile, 'find').yields(new Error());
  //   server.inject({method: 'GET', url: '/profiles?page=1', credentials: {_id: 'b00000000000000000000004'}}, function(response){
  //     expect(response.statusCode).to.equal(400);
  //     stub.restore();
  //     done();
  //   });
  // });
});
