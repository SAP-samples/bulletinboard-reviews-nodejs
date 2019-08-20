'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const HTTP_NO_CONTENT = 204
const HTTP_CREATED = 201
const HTTP_CONFLICT = 409

function ExpressServer(reviewsService) {

	let httpServer
	const app = express()
	app.use(bodyParser.json())

	app.use(express.static('ui'));

	app.get('/api/v1/reviews', async function readAll(req, res) {
		const result = await reviewsService.getAll()
		res.send(result)
	})

	app.get('/api/v1/reviews/:revieweeEmail', async function readAll(req, res) {
		const revieweeEmail = req.params.revieweeEmail;
		const result = await reviewsService.getAllFor(revieweeEmail)
		res.send(result)
	})

	app.get('/api/v1/averageRatings/:email', async function getAverageUserRating(req, res) {
		const result = await reviewsService.getAverageRating(req.params.email)
		res.send(result)
	})

	app.post('/api/v1/reviews', async function create(req, res) {
		try {
			await reviewsService.create(req.body)
		} catch (err) {
			return res.status(HTTP_CONFLICT).end()
		}
		res.status(HTTP_CREATED).location(req.body.component_name).end()
	})

	app.delete('/api/v1/reviews', async function deleteAll(req, res) {
		await reviewsService.deleteAll()
		res.status(HTTP_NO_CONTENT).end()
	})

	this.start = function (port) {
		//REVISE are we listening to early - what if the DB is not yet connected?
		httpServer = app.listen(port)
		console.log(`Server started on port ${port}`)
	}

	this.stop = async function () {
		await reviewsService.stop()
		httpServer.close()
	}
}

module.exports = ExpressServer
