'use strict';

const DBMigrate = require('db-migrate');

module.exports = async (dbConnectionUri, silent = false) => {
  process.env.DATABASE_URL = dbConnectionUri;
  const dbmigrate = await DBMigrate.getInstance(true, {'throwUncatched': true});
  dbmigrate.silence(silent);
  await dbmigrate.up();
};
