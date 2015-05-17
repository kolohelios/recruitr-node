'use strict';

var User = require('../../../models/user');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/users',
    config: {
      description: 'get a list of users',
      handler: function(request, reply){
        User.findById(request.auth.credentials._id, function(err, user){
          if(err){ return reply().code(400); }
          if(user.role === 10){
            User.find(function(userErr, users){
              return reply(users).code(userErr ? 400 : 200);
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
  name: 'users.index'
};
