'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const HTTP_NO_CONTENT = 204
const HTTP_CREATED = 201

function ExpressServer(reviewsService) {

	var httpServer
	const app = express()
	app.use(bodyParser.json())

	app.get('/api/v1/reviews', async function readAll(req, res) {
		var result = await reviewsService.getAll()
		res.send(result)
	})

	app.get('/api/v1/averageRatings/:email', async function getAverageUserRating(req, res) {
		var result = await reviewsService.getAverageRating(req.params.email)
		res.send(result)
	})

	app.post('/api/v1/reviews', async function create(req, res) {
		await reviewsService.create(req.body)
		res.status(HTTP_CREATED).location(req.body.component_name).end()
	})

	app.delete('/api/v1/reviews', async function deleteAll(req, res) {
		await reviewsService.deleteAll()
		res.status(HTTP_NO_CONTENT).end()
	})

	this.start = function(port) {
		//REVISE are we listening to early - what if the DB is not yet connected?
		httpServer = app.listen(port)
		console.log(`Server started on port ${port}`)
	}

	this.stop = async function() {
		await reviewsService.stop()
		httpServer.close()
	}
}

module.exports = ExpressServer
