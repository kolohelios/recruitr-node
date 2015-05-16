'use strict';

var Profile = require('../../../models/profile');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/profiles',
    config: {
      description: 'get a list of profiles',
      handler: function(request, reply){
        Profile.find(function(err, profiles){
          return reply(profiles).code(err ? 400 : 200);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'profiles.index'
};
