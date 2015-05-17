'use strict';

var User = require('../../../models/user');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'DELETE',
    path: '/users/{userId}',
    config: {
      validate: {
        params: {
          userId: Joi.string().hex()
        }
      },
      description: 'Delete a user',
      handler: function(request, reply){
        User.findOne({_id: request.auth.credentials._id}, function(err, adminUser){
          if(err){
            return reply().code(400);
          }
          if(adminUser.role === 10){
            User.findByIdAndRemove(request.params.userId, function(adminErr, user){
              if(!user || adminErr){
                return reply().code(400);
              }
<<<<<<< HEAD
              // user.remove(function(removedUser){
              return reply(user);
              // });
=======
              return reply(user);
>>>>>>> 5919ba61e90b1ef8f515043391fa31f82ddbdaf6
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
