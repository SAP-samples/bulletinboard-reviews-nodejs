'use strict'

var pg = require('pg')

function PostgresReviewsService(dbConnectionUri) {

    const pool = new pg.Pool({ 'connectionString': dbConnectionUri })
    const CREATE_SQL = 'create table if not exists "reviews" ("reviewee_email" varchar, "reviewer_email" varchar, "rating" integer, "comment" varchar, primary key (reviewee_email, reviewer_email))'
    
    const tableInitialized = pool.query(CREATE_SQL).then(function() {
        console.log("Database connection established")
    })

    this.getAll = async function() {
        await tableInitialized
        var result = await pool.query('select * from "reviews"')
        return result.rows
    }

    this.getAverageRating = async function(revieweeEmail) {
        var result = await pool.query(`select avg(rating) as "average_rating" from "reviews" where "reviewee_email" = '${revieweeEmail}'`)
        return result.rows[0]
    }

    this.getAverageRatings = async function() {
        var result = await pool.query(`select avg(rating) as "average_rating", "reviewee_email" from "reviews" group by "reviewee_email" order by "average_rating" desc`)
        return result.rows
    }

    this.create = async function(review) {
        await tableInitialized
        const query = 'insert into "reviews" ("reviewee_email", "reviewer_email", "rating", "comment") values ($1, $2, $3, $4)'
        const values = [ review.reviewee_email, review.reviewer_email, review.rating, review.comment ]
        await pool.query(query, values)
    }

    this.deleteAll = async function() {
        await tableInitialized
        await pool.query('delete from "reviews"')
    }

    this.stop = async function() {
        await pool.end()
    }
}

module.exports = PostgresReviewsService
