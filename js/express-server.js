'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const HTTP_NO_CONTENT = 204
const HTTP_CREATED = 201
const HTTP_CONFLICT = 409
const INTERNAL_SERVER_ERROR = 500

function ExpressServer(reviewsService) {

	let httpServer
	const app = express()
	app.use(bodyParser.json())

	app.use(express.static('ui'))

	app.get('/api/v1/reviews', tryCatch(async function readAll(req, res) {
		const result = await reviewsService.getAll()
		res.send(result)
	}))

	app.get('/api/v1/reviews/:revieweeEmail', tryCatch(async function readAll(req, res) {
		const revieweeEmail = req.params.revieweeEmail
		const result = await reviewsService.getAllFor(revieweeEmail)
		res.send(result)
	}))

	app.get('/api/v1/averageRatings/:email', tryCatch(async function getAverageUserRating(req, res) {
		const result = await reviewsService.getAverageRating(req.params.email)
		res.send(result)
	}))

	app.post('/api/v1/reviews', tryCatch(async function create(req, res) {
		try {
			await reviewsService.create(req.body)
		} catch (err) {
			return res.status(HTTP_CONFLICT).end()
		}
		res.status(HTTP_CREATED).location(req.body.component_name).end()
	}))

	app.delete('/api/v1/reviews', tryCatch(async function deleteAll(req, res) {
		await reviewsService.deleteAll()
		res.status(HTTP_NO_CONTENT).end()
	}))

	this.start = function (port) {
		//REVISE are we listening to early - what if the DB is not yet connected?
		httpServer = app.listen(port).on('error', function (error) {
			console.error(`Failed to start server at port ${port}, port might be in use.`)
			console.error(error.stack)
			process.exit(2)
		})
		console.log(`Server started on port ${port}`)
	}

	this.stop = async function () {
		await reviewsService.stop()
		httpServer.close()
	}
}

const tryCatch = (wrappedMiddleware) => {
	return async (req, res, next) => {
	    try {
		    await wrappedMiddleware(req, res, next)
	  	} catch (error) {
			console.error(error.stack)
		  	if (res.headersSent) {
				next(error)
		  	} else {
				res.status(INTERNAL_SERVER_ERROR).send('INTERNAL_SERVER_ERROR')
		  	}
	    }
    }
}

module.exports = ExpressServer
