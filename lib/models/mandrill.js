var Mandrill = require('node-mandrill')(process.env.MANDRILL_API_KEY);

function sendMessage(messageToSend){
  Mandrill('/messages/send', messageToSend, function(error, response)
  {
  //uh oh, there was an error
  if (error) console.log( JSON.stringify(error) );

  //everything's good, lets see what mandrill said
  else console.log(response);
  return response;
  });
}

module.exports = {sendMessage:sendMessage};
