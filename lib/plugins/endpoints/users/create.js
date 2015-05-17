'use strict';

var User = require('../../../models/user');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/users',
    config: {
      validate: {
        payload: {
          email: Joi.string().email().lowercase().trim().required(),
          password: Joi.string().trim(),
          role: Joi.number(),
          createdAt: Joi.date(),
          firstName: Joi.string(),
          lastName: Joi.string(),
          company: Joi.string()
        }
      },
      description: 'Create a user',
      handler: function(request, reply){
        console.log('the fucking id is *****************', request.auth.credentials._id);
        User.findOne({_id: request.auth.credentials._id}, function(err, user){
          if(err || user.role !== 10){
            return reply().code(400);
          }
          User.register(request.payload, function(error, validUser){
            if(error || !validUser){return reply().code(400); }
            validUser.password = null;
            return reply(validUser);
          });
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'users.create'
};
