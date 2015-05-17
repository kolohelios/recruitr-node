'use strict';

var User = require('../../../models/user');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'DELETE',
    path: '/users/{userId}',
    config: {
      // auth: false,
      validate: {
        params: {
          userId: Joi.string().hex()
        },
      },
      description: 'Delete a user',
      handler: function(request, reply){
        User.findOne({_id: request.auth.credentials._id}, function(err, user){
          if(err){
            return reply().code(400);
          }
          if(user.role === 'admin'){
            User.findOne({_id: request.params.userId}, function(err, user){
              if(err || !user){
                return reply().code(400);
              }
              user.remove(function(user){
                console.log('after remove user is', user);
                return reply(user);
              });
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
  name: 'users.delete'
};
