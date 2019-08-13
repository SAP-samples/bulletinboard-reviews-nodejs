const assert = require('assert')
const PostgresReviewsService = require('../js/postgres-reviews-service')
const ExpressServer = require('../js/express-server')
const request = require('supertest');

const DB_CONNECTION_URI = 'postgres://postgres@localhost:6543/postgres';
const PORT = 9090;

describe('Server', function () {
    let server
    let baseUrl

    before(async function () {
        server = new ExpressServer(new PostgresReviewsService(DB_CONNECTION_URI))
        server.start(PORT)
        baseUrl = request(`http://localhost:${PORT}`)
        await baseUrl.delete('/api/v1/reviews').expect(204)
    })

    after(async function () {
        server.stop()
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
})
