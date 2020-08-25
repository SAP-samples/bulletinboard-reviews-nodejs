'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const HTTP_NO_CONTENT = 204
const HTTP_CREATED = 201
const HTTP_CONFLICT = 409
const INTERNAL_SERVER_ERROR = 500
const logger = require('./logger')

function ExpressServer(reviewsService, defaultLogger) {

	let httpServer
	const app = express()
	app.use(bodyParser.json())

	app.use(express.static('ui'))

	app.get('/api/v1/reviews', wrap(async function readAll(req, res) {
		const result = await reviewsService.getAll()
		res.send(result)
	}))

	app.get('/api/v1/reviews/:revieweeEmail', wrap(async function readAll(req, res) {
		const revieweeEmail = req.params.revieweeEmail
		const result = await reviewsService.getAllFor(revieweeEmail)
		res.send(result)
	}))

	app.get('/api/v1/averageRatings/:email', wrap(async function getAverageUserRating(req, res, next, requestLogger) {
		let result = await reviewsService.getAverageRating(req.params.email)
		if (result.average_rating === null) {
			requestLogger.info('No ratings found for %s', req.params.email)
		}
		res.send(result)
	}))

	app.post('/api/v1/reviews', wrap(async function create(req, res) {
		try {
			await reviewsService.create(req.body)
		} catch (err) {
			return res.status(HTTP_CONFLICT).end()
		}
		res.status(HTTP_CREATED).location(req.body.component_name).end()
	}))

	app.delete('/api/v1/reviews', wrap(async function deleteAll(req, res) {
		await reviewsService.deleteAll()
		res.status(HTTP_NO_CONTENT).end()
	}))

	this.start = function (port) {
		//REVISE are we listening to early - what if the DB is not yet connected?
		httpServer = app.listen(port).on('error', function (error) {
			defaultLogger.error(error.stack)
			process.exit(2)
		})
		defaultLogger.info(`Server started on port ${port}`)
	}

	this.stop = async function () {
		await reviewsService.stop()
		httpServer.close()
	}
}

//wraps the middleware with a try catch and injects a logger as additional argument
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

module.exports = ExpressServer
