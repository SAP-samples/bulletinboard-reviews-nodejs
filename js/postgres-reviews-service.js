'use strict'

const pg = require('pg')

function PostgresReviewsService(dbConnectionUri, defaultLogger) {
    const pool = new pg.Pool({ 'connectionString': dbConnectionUri })

    const CREATE_SQL = `CREATE TABLE IF NOT EXISTS "reviews" (
        "reviewee_email" VARCHAR (256),
        "reviewer_email" VARCHAR (256),
        "rating" INTEGER,
        "comment" VARCHAR (1024),
        PRIMARY KEY ("reviewee_email", "reviewer_email"))`

    const tableInitialized = pool.query(CREATE_SQL).then(function () {
        defaultLogger.info('Database connection established')
    }).catch(function(error) {
        defaultLogger.error(error.stack)
        process.exit(1)
    })

    this.getAll = async function () {
        await tableInitialized
        const result = await pool.query('SELECT * FROM "reviews"')
        return result.rows
    }

    this.getAllFor = async function (revieweeEmail) {
        await tableInitialized
        const result = await pool.query('SELECT * FROM "reviews" WHERE reviewee_email = $1', [revieweeEmail])
        return result.rows
    }

    this.getAverageRating = async function (revieweeEmail) {
        await tableInitialized
        const result = await pool.query('SELECT avg(rating) AS "average_rating" FROM "reviews" WHERE "reviewee_email" = $1',[revieweeEmail])
        return result.rows[0]
    }

    this.create = async function (review) {
        await tableInitialized
        const query = 'INSERT INTO "reviews" ("reviewee_email", "reviewer_email", "rating", "comment") VALUES ($1, $2, $3, $4)'
        const values = [review.reviewee_email, review.reviewer_email, review.rating, review.comment]
        await pool.query(query, values)
    }

    this.deleteAll = async function () {
        await tableInitialized
        await pool.query('DELETE FROM "reviews"')
    }

    this.stop = async function () {
        await pool.end()
    }
}

module.exports = PostgresReviewsService
