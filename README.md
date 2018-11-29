# bulletinboard-reviews
This is the reviews service of the bulletin board. It doesn't have a GUI at this point, however you can interact with it using a REST client like Postman.

## How to work locally

Use the script `run-locally <script>`. Supply the script defined in package.json, e.g. `start` to start the server, `start:debug` to run the server in debug mode, `test` to execute the tests and `test:debug` to run the tests in debug mode.

## How to work in the cloud

Use script `deploy-to-cf.sh`.
**Important:** Please alter the `deploy-to-cf.sh` script or the `manifest.yml` in order to provide a unique host name (e.g. your team name).

## API

The following endpoints are supported and tested:
- `GET /api/v1/averageRatings/:email`: given the email of a user, get his/her average rating
  Response: `200 OK`
  Response Body:
  ```
    { "average_rating": <number> }
  ```
- `GET /api/v1/reviews`: get all reviews
  Response: `200 OK`
  Response Body:
  ```
    [
        {
            "reviewee_email": <text>, 
            "reviewer_email": <text>, 
            "rating": <integer>, 
            "comment": <text>
        },
        ...
    ]
  ```
- `POST /api/v1/reviews`: post a new review
  Request Body:
  ```
    {
        "reviewee_email": <text>, 
        "reviewer_email": <text>, 
        "rating": <integer>, 
        "comment": <text>
    }
  ```
  Response: `201 Created`
- `DELETE /api/v1/reviews`: delete all reviews
  Response: `204 No Content`
