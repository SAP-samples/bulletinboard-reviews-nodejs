'use strict'

const ExpressServer = require('./express-server')
const PostgresReviewsService = require('./postgres-reviews-service')
const VCAP_SERVICES = process.env.VCAP_SERVICES
let DB_CONNECTION_URI  = process.env.POSTGRES_URI

if (VCAP_SERVICES) {
    const vcapServices = JSON.parse(VCAP_SERVICES)
    DB_CONNECTION_URI = vcapServices.postgresql[0].credentials.uri
}

const server = new ExpressServer(new PostgresReviewsService(DB_CONNECTION_URI))

server.start(process.env.PORT)
