'use strict'

const pg = require('pg')

function PostgresReviewsService(dbConnectionUri) {

    const pool = new pg.Pool({ 'connectionString': dbConnectionUri })

    this.getAll = async function () {
        const result = await pool.query('select * from "reviews"')
        return result.rows
    }

    this.getAllFor = async function (revieweeEmail) {
        const result = await pool.query('select * from "reviews" where reviewee_email = $1', [revieweeEmail])
        return result.rows
    }

    this.getAverageRating = async function (revieweeEmail) {
        const result = await pool.query(`select avg(rating) as "average_rating" from "reviews" where "reviewee_email" = '${revieweeEmail}'`)
        return result.rows[0]
    }

    this.create = async function (review) {
        const query = 'insert into "reviews" ("reviewee_email", "reviewer_email", "rating", "comment") values ($1, $2, $3, $4)'
        const values = [review.reviewee_email, review.reviewer_email, review.rating, review.comment]
        await pool.query(query, values)
    }

    this.deleteAll = async function () {
        await pool.query('delete from "reviews"')
    }

    this.stop = async function () {
        await pool.end()
    }
}

module.exports = PostgresReviewsService
