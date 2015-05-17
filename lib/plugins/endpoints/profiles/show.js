'use strict';

var Profile = require('../../../models/profile');
var Joi = require('joi');
var User = require('../../../models/user');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/profiles/{profileId}',
    config: {
      validate: {
        params: {
          profileId: Joi.string().hex().length(24).required()
        }
      },
      description: 'get a single profile and restrict data for viewers',
      handler: function(request, reply){
        User.findById(request.auth.credentials._id, function(er, user){
          if(!user || er){ return reply().code(400); }
          if(user.role > 4){
            Profile.findOne({_id: request.params.profileId}, function(err, profile){
              return reply(profile).code(err ? 400 : 200);
            });
          }else{
            Profile.findById(request.params.profileId, function(error, pro){
              if(!pro || error){ return reply().code(400); }
              pro.lastName = null;
              pro.photo = null;
              pro.bio = null;
              pro.contact = null;
              pro.social = null;
              return reply(pro).code(200);
            });
          }
        });
      }
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'profiles.show'
};
