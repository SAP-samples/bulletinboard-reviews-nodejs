# bulletinboard-reviews
This is the **node.js** version of the reviews-service for the bulletin board application.
Reviews of users can be created, deleted and viewed.
You can interact with the service using a REST client like Postman or the GUI.

**Note:** Reviews refer to the _users_ that advertize things, _not_ the advertised things.

## How to work locally

To execute the tests or to start the service a local database is needed.
The script `start-db.sh` can be used to start a local database (using docker).

Also the dependencies need to be installed. Run `npm install` to install those.

### Execute tests
The tests can be executed with npm: `npm test`

### Start service locally
Run `npm start` to start the service.
The service will listen on port 8080.

## A word on cloud readiness

### CloudFoundry
To speed a up the configuration for a deployment in CloudFoundry a [manifest.yaml](manifest.yaml) with placeholders is provided.

### Kubernetes
For a deployment of the service in Kubernetes a pre-configured yaml-file ([k8s-minimal.yaml](k8s-minimal.yaml)) with placeholders is already part of the repository.
Along with a basic [Dockerfile](Dockerfile).

## Interact with the application

### Using the GUI
Reviews for a user `[email]` can be made at `/#/reviews/:email`.

### Using the API
The following endpoints are supported and tested (remember to set the `application/json` content-type header):
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
