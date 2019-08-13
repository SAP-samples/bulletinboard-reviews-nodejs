# bulletinboard-reviews
This is the reviews service of the bulletin board. It doesn't have a GUI at this point, however you can interact with it using a REST client like Postman. **Note:** Reviews are made for the _users_ that advertize things, _not_ for the advertised things.

## How to work locally

Use the script `run-db.sh` to start your local postgres DB instance. Afterwards, you can run `start-app-locally.sh` to start your local API endpoint. Optionally, you can add the parameter `debug` in order to start your local server in debug mode.

## How to work in the cloud

Use script `deploy-to-cf.sh`.

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
