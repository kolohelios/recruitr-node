'use strict';

var Profile = require('../../../models/profile');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/profiles/{pageNum}/',
    config: {
      description: 'get a list of profiles',
      handler: function(request, reply){
        var page = request.params.pageNum;
        var limitPerPage = 10;

        Profile.find(function(e, p){
          if(e){ return reply().code(400); }
          var totalLength = p.length;
          Profile.find(function(err, profiles){
            if(err){ return reply().code(400); }
            console.log(totalLength, '!@#$%^&*()^%$^%#$*');
            return reply({profiles: profiles, total: totalLength});
          }).limit(limitPerPage).skip((page - 1) * limitPerPage);
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'profiles.index'
};
