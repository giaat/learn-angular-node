'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const Sequelize = require('sequelize');

const opts = {
  dialect: 'postgres',
  host: 'localhost',
  port: '5432',
};

server.connection({
  host: 'localhost',
  port: 8888,
});

server
  .register([
    {
      register: require('hapi-sequelize'),
      options: {
        name: 'db',
        sequelize: new Sequelize('learn-angular-node', 'postgres', 'mathilde22', opts),
        models: ['lib/**/model.js', 'lib/**/models/*.js'],
      },
    },
    require('./lib/task'),
  ])
  .then(() => {
    const db = server.plugins['hapi-sequelize']['db'];

    // Reload the database when the server is restarted (only in dev mode).
    return db.sequelize.sync({
      force: false,
    });
  })
  .catch(err => {
    console.error('Failed to load a plugin: ', err);
    process.exit(2);
  })
  .then(() => {
    // Success callback for the db.sequelize.sync() function call above.
    console.log('Models synced: [' + 'OK' + ']');
    return server.start();
  })
  .then(() => {
    console.log('Server running at:', server.info.uri);
  })
  .catch(err => {
    console.error(`Started server with errors: ${err}`);
    process.exit(3);
  });

module.exports = server;
