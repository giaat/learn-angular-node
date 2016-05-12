'use strict';

var Hapi = require('hapi');
var server = new Hapi.Server();
var routes = require('./route');

server.connection({
  host: 'localhost',
  port: 8888
});

server.start((err) => {
    if (err) {
      throw err;
    }
    console.log('Server running at:', server.info.uri);
});

server.route(routes);
