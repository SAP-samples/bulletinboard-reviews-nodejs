import express from 'express'
import logger from './logger.js'

const HTTP_NO_CONTENT = 204
const HTTP_CREATED = 201
const HTTP_CONFLICT = 409
const INTERNAL_SERVER_ERROR = 500

class ExpressServer {
  #app
  #httpServer
  #reviewsService
  #logger

  constructor (reviewsService, logger) {
    this.#reviewsService = reviewsService
    this.#logger = logger
    this.#app = express()
    this.#setupRoutesAndMiddlewares()
  }

  async start (port) {
    this.#httpServer = this.#app.listen(port).on('error', function (error) {
      this.#logger.error(error.stack)
      process.exit(2)
    })
    this.#logger.info(`Server started on port ${port}`)
  }

  async stop () {
    await this.#reviewsService.stop()
    this.#httpServer.close()
  }

  #setupRoutesAndMiddlewares () {
    this.#app.use(express.json())

    this.#app.use(express.static('ui'))

    this.#app.get('/api/v1/reviews', wrap(async (req, res) => {
      const result = await this.#reviewsService.getAll()
      res.send(result)
    }))

    this.#app.get('/api/v1/reviews/:revieweeEmail', wrap(async (req, res) => {
      const revieweeEmail = req.params.revieweeEmail
      const result = await this.#reviewsService.getAllFor(revieweeEmail)
      res.send(result)
    }))

    this.#app.get('/api/v1/averageRatings/:email', wrap(async (req, res, next, requestLogger) => {
      const result = await this.#reviewsService.getAverageRating(req.params.email)
      if (result.average_rating === null) {
        requestLogger.info('No ratings found for %s', req.params.email)
      }
      res.send(result)
    }))

    this.#app.post('/api/v1/reviews', wrap(async (req, res) => {
      try {
        await this.#reviewsService.create(req.body)
      } catch (err) {
        return res.status(HTTP_CONFLICT).end()
      }
      res.status(HTTP_CREATED).location(req.body.component_name).end()
    }))

    this.#app.delete('/api/v1/reviews', wrap(async (req, res) => {
      await this.#reviewsService.deleteAll()
      res.status(HTTP_NO_CONTENT).end()
    }))
  }
}

// wraps the middleware with a try catch and injects a logger as additional argument
const wrap = (wrappedMiddleware) => {
  return async (req, res, next) => {
    const requestLogger = logger.create()
    try {
      await wrappedMiddleware(req, res, next, requestLogger)
    } catch (error) {
      requestLogger.error(error.stack)
      if (res.headersSent) {
        next(error)
      } else {
        res.status(INTERNAL_SERVER_ERROR).send('INTERNAL_SERVER_ERROR')
      }
    }
  }
}

export default ExpressServer
