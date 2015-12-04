var Hapi = require('hapi');
var request = require('request');
var appData = {};

var server = new Hapi.Server();
server.connection({ port: 3000, routes: { cors: true } });

request('https://notashittyapp.firebaseio.com/appData.json', function(error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log('getTokens', body);

    appData.tokens = JSON.parse(body);
    console.log('AppData: ', appData);
  }
});

server.route({
  method: 'GET',
  path: '/media/images/random',
  handler: function(req, reply) {
    var options = {
      url: 'https://api.unsplash.com/photos/random',
      headers: {
        'Authorization': 'Client-ID ' + appData.tokens.unsplashAuth
      }
    }
    console.log('appData', appData);
    console.log('Random Image Options: ', options)
    request(options, function(error, response, body) {
      // console.log('UnsplashAPI Res: ', error, response, body)
      if (!error && response.statusCode == 200) {
        var res = JSON.parse(body);
        console.log('Get Random Image: ', body)
        reply(res);
      } else{
        console.error('Get Random Image', error);
        reply(new Error('Returned'));
      }
    })

  }
});

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
