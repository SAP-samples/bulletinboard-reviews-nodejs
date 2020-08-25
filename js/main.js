'use strict'
const ExpressServer = require('./express-server')
const PostgresReviewsService = require('./postgres-reviews-service')
const logger = require('./logger')

const DB_CONNECTION_URI_DEFAULT = "postgres://postgres@localhost:6543/postgres"
const PORT_DEFAULT = 9090

const dbUriCf = process.env.VCAP_SERVICES ? JSON.parse(process.env.VCAP_SERVICES).postgresql[0].credentials.uri : undefined
const dbUriK8s = process.env.POSTGRES_URI
const dbConnectionUri = dbUriCf || dbUriK8s || DB_CONNECTION_URI_DEFAULT

const defaultLogger = logger.create()

const reviewsService = new PostgresReviewsService(dbConnectionUri, defaultLogger)
const server = new ExpressServer(reviewsService, defaultLogger)

const port = process.env.PORT || PORT_DEFAULT
server.start(port)
