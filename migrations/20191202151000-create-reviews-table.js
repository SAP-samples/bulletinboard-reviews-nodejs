'use strict';

exports.up = (db, callback) => {
  db.runSql(`CREATE TABLE IF NOT EXISTS "reviews"
  (
    "reviewee_email" VARCHAR,
    "reviewer_email" VARCHAR,
    "rating" INTEGER,
    PRIMARY KEY (reviewee_email, reviewer_email)
 )`, callback);
};
