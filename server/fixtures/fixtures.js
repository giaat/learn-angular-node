'use strict';

const exec = require('child_process').exec;

const dbName = 'learn-angular-node';
const user = 'postgres';
const password = 'mathilde22';
const host = 'localhost';
const port = '5432';

exec(
  `cat ./fixtures/task/postgres.sql \
    ./fixtures/tag/postgres.sql | PGPASSWORD=${password} psql -U ${user} -h ${host} -p ${port} -d ${
    dbName
  }
  `,
  (error, stdout, stderr) => {
    console.log(stdout);

    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }

    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  }
);
