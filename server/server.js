'use strict';

const Hapi = require('hapi');
const Sequelize = require('sequelize');
const chalk = require('chalk');
const { Line } = require('clui');
const ora = require('ora');

const config = require('./config');

config.init(process.argv);
const loadFixtures = require('./fixtures');

const server = new Hapi.Server();

// CLI pretty things
const blankLine = new Line().fill();
const pluginsSpinner = ora('Loading plugins');
const modelsSpinner = ora('Models synchronization');
const fixturesSpinner = ora('Loading fixtures');
const serverSpinner = ora('Starting server');

server.connection({
  host: config.get('/server/host'),
  port: config.get('/server/port'),
});

// //////////////////////////////////////////////////////////////////
//                                                                 //
//                      Plugins registration                       //
//                                                                 //
// //////////////////////////////////////////////////////////////////
blankLine.output();
pluginsSpinner.start();

server
  .register([
    {
      register: require('hapi-sequelize'),
      options: {
        name: config.get('/database/name'),
        sequelize: new Sequelize(
          config.get('/database/credentials/dbName'),
          config.get('/database/credentials/user'),
          config.get('/database/credentials/pass'),
          {
            dialect: config.get('/database/credentials/dialect'),
            host: config.get('/database/credentials/host'),
            port: config.get('/database/credentials/port'),
          }
        ),

        models: ['lib/**/model.js', 'lib/**/models/*.js'],
      },
    },
    require('./lib/task'),
  ])
  .catch(err => {
    pluginsSpinner.fail(`Loading plugins: ${err.stack}`);
    blankLine.output();
    process.exit(4);
  })
  // ///////////////////////////////////////////////////////////////////////
  //                                                                      //
  //                      Plugins configuration                           //
  //                                                                      //
  // ///////////////////////////////////////////////////////////////////////
  .then(() => {
    pluginsSpinner.succeed();

    blankLine.output();
    modelsSpinner.start();

    const db = server.plugins['hapi-sequelize'][config.get('/database/name')];

    // Reload the database when the server is restarted (only in dev mode).
    return db.sequelize.sync({ force: config.get('/database/syncForce') });
  })
  .catch(err => {
    modelsSpinner.fail(`Models synchronization: ${err.stack}`);
    blankLine.output();
    process.exit(2);
  })
  ////////////////////////////////////////////////////////////////////
  //                                                                //
  //                      Start the server                          //
  //                                                                //
  ////////////////////////////////////////////////////////////////////
  .then(() => {
    // Success callback for the db.sequelize.sync() function call above.
    modelsSpinner.succeed();

    blankLine.output();
    fixturesSpinner.start();

    if (config.get('/database/syncForce') === true) {
      return loadFixtures();
    }

    return null;
  })
  .catch(({ stderr }) => {
    fixturesSpinner.fail(`Loading fixtures: ${stderr}`);
    process.exit(3);
  })
  .then(() => {
    if (config.get('/database/syncForce') === true) {
      fixturesSpinner.succeed();
    } else {
      fixturesSpinner.warn();
    }

    blankLine.output();
    serverSpinner.start();

    return server.start();
  })
  .then(() => {
    serverSpinner.succeed(
      chalk`Server started on port : [{yellowBright ${config.get('/server/port')}}]`
    );
    blankLine.output();
  })
  .catch(err => {
    serverSpinner.fail(`Started server with errors: ${err.stack}`);
    blankLine.output();
    process.exit(5);
  });

module.exports = server;
