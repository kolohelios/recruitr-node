/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var CP = require('child_process');
var Path = require('path');
var Sinon = require('sinon');
var Server = require('../../../../lib/server');
var Profile = require('../../../../lib/models/profile');
var User = require('../../../../lib/models/user');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var beforeEach = lab.beforeEach;
var before = lab.before;
var after = lab.after;
var server;

describe('DELETE /profiles/{profileId}', function(){
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
  it('should delete an existing profile', function(done){
    server.inject({method: 'DELETE', url: '/profiles/a00000000000000000000002', credentials: {_id: 'b00000000000000000000004'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.lastName).to.equal('Gatchell');
      done();
    });
  });
  it('should return error for non-admin', function(done){
    server.inject({method: 'DELETE', url: '/profiles/a00000000000000000000002', credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  it('should cause db error on findOne', function(done){
    var stub = Sinon.stub(User, 'findOne').yields(new Error());
    server.inject({method: 'DELETE', url: '/profiles/a00000000000000000000002', credentials: {_id: 'b00000000000000000000001'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
  it('should cause db error on findByIdAndUpdate', function(done){
    var stub = Sinon.stub(Profile, 'findByIdAndRemove').yields(new Error());
    server.inject({method: 'DELETE', url: '/profiles/a00000000000000000000002', credentials: {_id: 'b00000000000000000000004'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
