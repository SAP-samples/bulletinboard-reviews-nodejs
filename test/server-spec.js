const assert = require('assert')
const sinon = require('sinon')
const PostgresReviewsService = require('../js/postgres-reviews-service')
const RabbitMQService = require('../js/rabbitmq-service')
const ExpressServer = require('../js/express-server')
const request = require('supertest');

const DB_CONNECTION_URI = 'postgres://postgres@localhost:6543/postgres'
const AMQP_URI = 'amqp://guest:guest@localhost:5672'
const PORT = 9090;

describe('Server', function () {
    let server
    let baseUrl
    let rabbitmqService

    before(async function () {
        rabbitmqService = new RabbitMQService(AMQP_URI)
        server = new ExpressServer(
            new PostgresReviewsService(DB_CONNECTION_URI),
            rabbitmqService
        )
        server.start(PORT)
        baseUrl = request(`http://localhost:${PORT}`)
        await baseUrl.delete('/api/v1/reviews').expect(204)
    })

    after(async function () {
        await server.stop()
    })

    afterEach(async function () {
        await baseUrl.delete('/api/v1/reviews').expect(204)
    })

    it('should return an empty list when there is no data', async function () {

        await baseUrl.get('/api/v1/reviews')
            .expect(200).expect('Content-Type', /application\/json/)
            .then(function (response) {
                const reviews = response.body
                assert.equal(reviews.length, 0)
            })
    })

    it('should respond with the review when there is one', async function () {

        await baseUrl.post('/api/v1/reviews').send({
            "reviewee_email": "john.doe@some.org",
            "reviewer_email": "frank.foe@other.org",
            "rating": 0,
            "comment": "d'oh"
        }).expect(201)

        await baseUrl.get('/api/v1/reviews').expect(200).then(function (response) {
            const reviews = response.body
            assert.equal(reviews.length, 1)
            assert.equal(reviews[0].reviewee_email, "john.doe@some.org")
            assert.equal(reviews[0].reviewer_email, "frank.foe@other.org")
            assert.equal(reviews[0].rating, 0)
            assert.equal(reviews[0].comment, "d'oh")
        })
    })

    it('should respond with 409 - Conflict if there is already an entry from the same reviewer', async function () {
        await baseUrl.post('/api/v1/reviews').send({
            "reviewee_email": "john.doe@some.org",
            "reviewer_email": "frank.foe@other.org",
            "rating": 0,
            "comment": "d'oh"
        })

        await baseUrl.post('/api/v1/reviews').send({
            "reviewee_email": "john.doe@some.org",
            "reviewer_email": "frank.foe@other.org",
            "rating": 1,
            "comment": "still not good"
        }).expect(409)
    })

    it('should respond with all reviews for a specific reviewee', async function () {
        await baseUrl.post('/api/v1/reviews').send({
            "reviewee_email": "john.doe@some.org",
            "reviewer_email": "frank.foe@other.org",
            "rating": 0,
            "comment": "d'oh"
        }).expect(201)

        await baseUrl.post('/api/v1/reviews').send({
            "reviewee_email": "jane.doe@some.org",
            "reviewer_email": "jane.joe@acme.org",
            "rating": 5,
            "comment": "cool person"
        }).expect(201)
        await baseUrl.get('/api/v1/reviews/john.doe@some.org')
            .expect(200).expect('Content-Type', /application\/json/)
            .then(function (response) {
                const reviews = response.body
                assert.equal(reviews.length, 1)
                assert.equal(reviews[0].reviewee_email, 'john.doe@some.org')
        })
    })

    it('should return average rating of 2.5 for two ratings of 0 and 5', async function () {

        await baseUrl.post('/api/v1/reviews').send({
            "reviewee_email": "john.doe@some.org",
            "reviewer_email": "frank.foe@other.org",
            "rating": 0,
            "comment": "d'oh"
        }).expect(201)

        await baseUrl.post('/api/v1/reviews').send({
            "reviewee_email": "john.doe@some.org",
            "reviewer_email": "jane.joe@acme.org",
            "rating": 5,
            "comment": "cool guy"
        }).expect(201)

        await baseUrl.get('/api/v1/averageRatings/john.doe@some.org').expect(200).then(function (response) {
            const averageRating = response.body
            assert.equal(averageRating.average_rating, 2.5)
        })
    })

    it('should send the averageRating whenever a rating is created', async function () {
        sinon.spy(rabbitmqService, 'notify')
        await baseUrl.post('/api/v1/reviews').send({
            "reviewee_email": "john.doe@some.org",
            "reviewer_email": "jane.joe@acme.org",
            "rating": 5,
            "comment": "cool guy"
        }).expect(201)

        assert.equal(rabbitmqService.notify.calledOnce, true)

        assert.equal(rabbitmqService.notify.getCall(0).args[0].reviewee_email, 'john.doe@some.org')
        assert.equal(rabbitmqService.notify.getCall(0).args[0].average_rating, '5.0000000000000000')
    })
})
