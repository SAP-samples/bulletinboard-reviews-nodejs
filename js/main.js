'use strict'

const ExpressServer = require('./express-server')
const PostgresReviewsService = require('./postgres-reviews-service')
const RabbitMQService = require('../js/rabbitmq-service')

const VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES)
const DB_CONNECTION_URI = VCAP_SERVICES.postgresql[0].credentials.uri
// TODO: Replace with CF Credentials
const AMQP_URI = 'amqp://guest:guest@localhost:5672'

const server = new ExpressServer(
    new PostgresReviewsService(DB_CONNECTION_URI),
    new RabbitMQService(AMQP_URI)
)
server.start(process.env.PORT)
