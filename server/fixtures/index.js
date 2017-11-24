'use strict';

const exec = require('child_process').exec;
const Q = require('q');
const config = require('../config');

const dbName = config.get('/database/credentials/dbName');
const user = config.get('/database/credentials/user');
const password = config.get('/database/credentials/pass');
const host = config.get('/database/credentials/host');
const port = config.get('/database/credentials/port');

module.exports = () =>
  Q.Promise((resolve, reject) => {
    exec(
      `cat ./fixtures/task/postgres.sql \
    ./fixtures/tag/postgres.sql | PGPASSWORD=${password} psql -U ${user} -h ${host} -p ${port} -d ${
        dbName
      }
  `,
      (error, stdout, stderr) => {
        if (error !== null || stderr) {
          return reject({ error, stderr });
        }

        return resolve(stdout);
      }
    );
  });
