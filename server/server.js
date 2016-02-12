'use strict';

var Hapi = require('hapi');
var server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 8888
});

/* Insert your code here */

server.start(function() {
  console.log('Server started on port 8888');
});
