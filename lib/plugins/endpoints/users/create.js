'use strict';

var User = require('../../../models/user');
var Joi = require('joi');
var Mandrill = require('../../../models/mandrill');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/users',
    config: {
      auth: false,
      validate: {
        payload: {
          email: Joi.string().email().lowercase().trim().required(),
          password: Joi.string().trim(),
          createdAt: Joi.date(),
          firstName: Joi.string(),
          lastName: Joi.string(),
          company: Joi.string()
        }
      },
      description: 'Create a user',
      handler: function(request, reply){
        // User.findOne({_id: request.auth.credentials._id}, function(err, user){
        //   if(err || user.role !== 10 || ){
        //     return reply().code(400);
        //   }
          // Mandrill();
          User.register(request.payload, function(error, validUser){
            if(error || !validUser){return reply().code(400); }
            var messageToSend = {
              message: {
                  to: [{email: request.payload.email, name: 'New User'}],
                  from_email:'agiledaemon@agilelabs.com',
                  subject: "Thank you",
                  text: "Thank you for creating an account with us. Please log in to the site with your email address and pasword: " + request.payload.password + " ."
              }
            };
            Mandrill.sendMessage(messageToSend);
            validUser.password = null;


            return reply(validUser);
          });
        // });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'users.create'
};
