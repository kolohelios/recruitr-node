/* eslint no-shadow: 0 */

'use strict';

var Profile = require('../../../models/profile');
var User = require('../../../models/user');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'DELETE',
    path: '/profiles/{profileId}',
    config: {
      validate: {
        params: {
          profileId: Joi.string().hex().length(24)
        }
      },
      description: 'Create a profile',
      handler: function(request, reply){
        User.findOne({_id: request.auth.credentials._id}, function(err, user){
          if(err){ return reply().code(400); }
          if(user.role === 'admin'){
            Profile.findByIdAndRemove(request.params.profileId, function(err, profile){
              return reply(profile).code(err ? 400 : 200);
            });
          }else{
            return reply().code(400);
          }
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'profiles.destroy'
};
