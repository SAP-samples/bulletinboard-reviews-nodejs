import ExpressServer from './express-server.js'
import PostgresReviewsService from './postgres-reviews-service.js'
import logger from './logger.js'

const PORT_DEFAULT = 9090

const DB_CFG_DEFAULT = { connectionString: 'postgres://postgres@localhost:6543/postgres' }
const cfEnvFlat = Object.entries(JSON.parse(process.env.VCAP_SERVICES || '{}')).map(e => e[1]).flat()
const cfCred = (cfEnvFlat.find(e => e.name === 'postgres-bulletinboard-reviews') || { credentials: null }).credentials
const dbCfgCf = cfCred ? { connectionString: cfCred.uri, ssl: { cert: cfCred.sslcert, ca: cfCred.sslrootcert } } : null
const dbCfgK8s = process.env.POSTGRES_URI ? { connectionString: process.env.POSTGRES_URI } : null
const dbCfg = dbCfgCf || dbCfgK8s || DB_CFG_DEFAULT

const defaultLogger = logger.create()

const reviewsService = new PostgresReviewsService(dbCfg, defaultLogger)
const server = new ExpressServer(reviewsService, defaultLogger)

const port = process.env.PORT || PORT_DEFAULT
server.start(port)
