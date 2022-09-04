import pg from 'pg'

class PostgresReviewsService {
  #pool
  #logger
  #tableInitialized

  #CREATE_SQL = `CREATE TABLE IF NOT EXISTS "reviews" (
        "reviewee_email" VARCHAR (256),
        "reviewer_email" VARCHAR (256),
        "rating" INTEGER,
        "comment" VARCHAR (1024),
        PRIMARY KEY ("reviewee_email", "reviewer_email"))`

  constructor (config, logger) {
    this.#logger = logger
    this.#pool = new pg.Pool(config)
    this.#tableInitialized = this.#pool.query(this.#CREATE_SQL).then(() => {
      this.#logger.info('Database connection established')
    }).catch((error) => {
      this.#logger.error(error.stack)
      process.exit(1)
    })
  }

  async getAll () {
    await this.#tableInitialized
    const result = await this.#pool.query('SELECT * FROM "reviews"')
    return result.rows
  }

  async getAllFor (revieweeEmail) {
    await this.#tableInitialized
    const result = await this.#pool.query('SELECT * FROM "reviews" WHERE "reviewee_email" = $1', [revieweeEmail])
    return result.rows
  }

  async getAverageRating (revieweeEmail) {
    await this.#tableInitialized
    const result = await this.#pool.query('SELECT avg("rating") AS "average_rating" FROM "reviews" WHERE "reviewee_email" = $1', [revieweeEmail])
    return result.rows[0]
  }

  async create (review) {
    await this.#tableInitialized
    const query = 'INSERT INTO "reviews" ("reviewee_email", "reviewer_email", "rating", "comment") VALUES ($1, $2, $3, $4)'
    const values = [review.reviewee_email, review.reviewer_email, review.rating, review.comment]
    await this.#pool.query(query, values)
  }

  async deleteAll () {
    await this.#tableInitialized
    await this.#pool.query('DELETE FROM "reviews"')
  }

  async stop () {
    await this.#pool.end()
  }
}

export default PostgresReviewsService
