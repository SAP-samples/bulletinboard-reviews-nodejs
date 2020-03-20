'use strict'

const ExpressServer = require('./express-server')
const PostgresReviewsService = require('./postgres-reviews-service')
const VCAP_SERVICES = process.env.VCAP_SERVICES
const DB_CONNECTION_URI_DEFAULT = "postgres://postgres@localhost:6543/postgres"
const PORT_DEFAULT = 9090
let dbConnectionUriVCAP

if (VCAP_SERVICES) {
    const vcapServices = JSON.parse(VCAP_SERVICES)
    dbConnectionUriVCAP = vcapServices.postgresql[0].credentials.uri
}
const server = new ExpressServer(new PostgresReviewsService(
    dbConnectionUriVCAP || process.env.POSTGRES_URI || DB_CONNECTION_URI_DEFAULT
))

server.start(process.env.PORT || PORT_DEFAULT)
