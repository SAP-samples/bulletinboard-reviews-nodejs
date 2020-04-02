'use strict'

const pg = require('pg')

function PostgresReviewsService(dbConnectionUri) {
    const pool = new pg.Pool({ 'connectionString': dbConnectionUri })

    const CREATE_SQL = `CREATE TABLE IF NOT EXISTS "reviews" (
        "reviewee_email" VARCHAR (256),
        "reviewer_email" VARCHAR (256),
        "rating" SMALLINT,
        "comment" VARCHAR (1024),
        PRIMARY KEY (reviewee_email, reviewer_email))`

    const tableInitialized = pool.query(CREATE_SQL).then(function () {
        console.log("Database connection established")
    }).catch(function(error) {
        console.error(`Could not establish database connection: '${dbConnectionUri}'`)
        console.error(error.stack)
        process.exit(1)
    })

    this.getAll = async function () {
        await tableInitialized
        const result = await pool.query('select * from "reviews"')
        return result.rows
    }

    this.getAllFor = async function (revieweeEmail) {
        await tableInitialized
        const result = await pool.query('select * from "reviews" where reviewee_email = $1', [revieweeEmail])
        return result.rows
    }

    this.getAverageRating = async function (revieweeEmail) {
        await tableInitialized
        const result = await pool.query(`select avg(rating) as "average_rating" from "reviews" where "reviewee_email" = '${revieweeEmail}'`)
        return result.rows[0]
    }

    this.create = async function (review) {
        await tableInitialized
        const query = 'insert into "reviews" ("reviewee_email", "reviewer_email", "rating", "comment") values ($1, $2, $3, $4)'
        const values = [review.reviewee_email, review.reviewer_email, review.rating, review.comment]
        await pool.query(query, values)
    }

    this.deleteAll = async function () {
        await tableInitialized
        await pool.query('delete from "reviews"')
    }

    this.stop = async function () {
        await pool.end()
    }
}

module.exports = PostgresReviewsService
