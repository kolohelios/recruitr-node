/* eslint handle-callback-err: 0 */
'use strict';

var Profile = require('../../../models/profile');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/profiles',
    config: {
      description: 'get a list of profiles',
      handler: function(request, reply){
        var queryObj = request.query;
        var pageNum = queryObj.page;
        var limitPerPage = 10;

        Profile.find(function(error, allProfiles){
          if(error){ return reply().code(400); }
          var totalLength = allProfiles.length;
          if(queryObj.skill || queryObj.locationPref || queryObj.relocate){
            Profile.find({$or: [
              {skills: {$all: queryObj.skill}},
              {locationPref: {$all: queryObj.locationPref}},
              {relocate: queryObj.relocate}
            ]},
            function(err, profiles){
              return reply({profiles: profiles, total: totalLength});
            }).limit(limitPerPage).skip((pageNum - 1) * limitPerPage);
          }else{
            Profile.find(function(profiles){
              return reply({profiles: profiles, total: totalLength});
            }).limit(limitPerPage).skip((pageNum) - 1) * limitPerPage;
          }
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'profiles.index'
};
