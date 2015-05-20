'use strict';

var Joi = require('joi');
var User = require('../../../models/user');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/users/{userId}',
    config: {
      validate: {
        params: {
          userId: Joi.string().hex().length(24).required()
        }
      },
      description: 'get a single user for admin users',
      handler: function(request, reply){
        User.findById(request.auth.credentials._id, function(er, user){
          if(!user || er){return reply().code(400); }
          if(user.role === 10){
            User.findOne({_id: request.params.userId}, function(err, user2){
              if(err){return reply().code(400); }
              return reply(user2);
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
  name: 'users.show'
};
