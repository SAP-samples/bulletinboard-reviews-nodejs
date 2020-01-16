'use strict'

const ExpressServer = require('./express-server')
const PostgresReviewsService = require('./postgres-reviews-service')

// const VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES)
// const DB_CONNECTION_URI = VCAP_SERVICES.postgresql[0].credentials.uri
const DB_CONNECTION_URI = process.env.POSTGRES_URI

const server = new ExpressServer(new PostgresReviewsService(DB_CONNECTION_URI))
server.start(process.env.PORT)
