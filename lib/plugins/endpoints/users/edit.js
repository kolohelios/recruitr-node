// 'use strict';
//
// var User = require('../../../models/user');
// var Joi = require('joi');
// var Bcrypt = require('bcrypt');
//
// exports.register = function(server, options, next){
//   server.route({
//     method: 'PUT',
//     path: '/users/{userId}',
//     config: {
//       auth: false,
//       validate: {
//         payload: {
//           email: Joi.string().email().lowercase().trim().required(),
//           password: Joi.string().trim(),
//           role: Joi.number().required(),
//           createdAt: Joi.date(),
//           firstName: Joi.string(),
//           lastName: Joi.string(),
//           company: Joi.string()
//         }
//       },
//       description: 'Edit a user',
//       handler: function(request, reply){
//         User.findOne({_id: request.params.userId}, function(err, user){
//           if(err || !user){return reply().code(400); }
//           user.email = request.payload.email;
//           user.password = Bcrypt.hashSync(request.payload.password, 8);
//           user.createdAt = Date.now();
//           user.role = request.payload.role;
//           user.save(function(error){
//             return reply(user).code(error ? 400 : 200);
//           });
//         });
//       }
//     }
//   });
//
//   return next();
// };
//
// exports.register.attributes = {
//   name: 'users.edit'
// };
'use strict';

var User = require('../../../models/user');
var Joi = require('joi');
var Bcrypt = require('bcrypt');

exports.register = function(server, options, next){
  server.route({
    method: 'PUT',
    path: '/users/{userId}',
    config: {
      auth: false,
      validate: {
        payload: {
          email: Joi.string().email().lowercase().trim(),
          password: Joi.string().trim(),
          role: Joi.string().trim(),
          createdAt: Joi.date(),
          firstName: Joi.string(),
          lastName: Joi.string(),
          company: Joi.string()
        }
      },
      description: 'Edit a user',
      handler: function(request, reply){
        User.findOne({_id: request.auth.credentials._id}, function(err, user){
          if(err || user.role !== 'admin'){
            return reply().code(400);
          }
          User.findOne({_id: request.params.userId}, function(error, validUser){
            if(error || !validUser){return reply().code(400); }
            user.email = request.payload.email;
            user.password = Bcrypt.hashSync(request.payload.password, 8);
            user.createdAt = Date.now();
            user.role = request.payload.role;
            user.save(function(er){
              return reply(user).code(er ? 400 : 200);
            });
          });
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'users.edit'
};
