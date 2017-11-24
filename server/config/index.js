'use strict';

const Confidence = require('confidence');
const Hoek = require('hoek');
const chalk = require('chalk');
const parseArgs = require('yargs-parser');

var dbCredentials = require('./database/credentials');
const argOptions = require('./arg-options');

let store = null;
// Set a variable to contain the selected environment for NodeJS or default to 'prod'.
// This keyword will then be used to choose between configurations.
const criteria = { env: process.env.NODE_ENV || 'dev' };

exports.get = key => {
  Hoek.assert(store !== null, chalk`{redBright You should call init() first}`);

  return store.get(key, criteria);
};

exports.init = argv => {
  Hoek.assert(store === null, chalk`{redBright You should call init() only once}`);
  Hoek.assert(Array.isArray(argv), chalk`{redBright Argv should be an array}`);

  const parsedArg = parseArgs(argv, argOptions);
  store = new Confidence.Store({
    database: {
      syncForce: {
        $filter: 'env',
        prod: false,
        dev: parsedArg.fixtures,
      },
      name: 'mainDB',
      credentials: {
        $filter: 'env',
        dev: {
          dbName: dbCredentials.dev.database,
          user: dbCredentials.dev.user,
          pass: dbCredentials.dev.pass,
          dialect: dbCredentials.dev.dialect,
          host: dbCredentials.dev.host,
          port: dbCredentials.dev.port,
        },
        test: {
          dbName: dbCredentials.test.database,
          user: dbCredentials.test.user,
          pass: dbCredentials.test.pass,
          dialect: dbCredentials.test.dialect,
          host: dbCredentials.test.host,
          port: dbCredentials.test.port,
        },
      },
    },

    server: {
      host: process.env.COMPARE_FOOD_HOST || 'localhost',
      port: process.env.COMPARE_FOOD_PORT || 8890,
    },
  });
};
