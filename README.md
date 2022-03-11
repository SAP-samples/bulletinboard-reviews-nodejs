# Bulletin Board - Reviews Service

## Description

This is the reviews service for the bulletin board application. Reviews refer to the _users_ who advertise things, _not_ the advertised things. The server is written in Node.js. The client is written using Preact and SAP UI5 Web Components.

## Requirements

The following tools are required to run the service locally:
- Node.js, v16 or later
- Docker engine, v20 or later
  - Alternatively, a PostgreSQL database, v9.6 or later
- Optionally a Bourne shell
  - Provided shell scripts make the startup easier
  - Git bash is a good choice for Windows users
## Local Setup

- Start a pre-configured database using Docker: `./start-db.sh`
  - If you want to start the database manually, or use your own PostgreSQL installation without Docker, have a look into the shell script to know the required configuration for version, database name, port, credentials and schema
- Install the required dependencies: `npm ci`
- Run the tests: `npm test`
- Start the service: `npm start`
  - The service will listen on port 9090

## Cloud Setup

### Cloud Foundry

For a deployment on Cloud Foundry, a pre-configured [manifest.yaml](manifest.yaml) with placeholders is provided.

### Kubernetes

For a deployment on Kubernetes, a pre-configured [k8s-minimal.yaml](k8s-minimal.yaml) with placeholders is provided, along with a basic [Dockerfile](Dockerfile).

## HTTP API

The following endpoints are supported and tested:
- `GET /api/v1/averageRatings/:contact`: get the average rating of a given contact
  - Response:
    - `200 OK`
  - Response Body:
    ```
    { "average_rating": <number> }
    ```
- `GET /api/v1/reviews`: get all reviews
  - Response:
    - `200 OK`
  - Response Body:
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
  - Request Headers:
    - `Content-Type: application/json`
  - Request Body:
    ```
    {
      "reviewee_email": <text>,
      "reviewer_email": <text>,
      "rating": <integer>,
      "comment": <text>
    }
    ```
  - Response:
    - `204 No Content`
- `DELETE /api/v1/reviews`: delete all reviews
  - Response:
    - `204 No Content`

## How to obtain support
[Create an issue](https://github.com/SAP-samples/bulletinboard-reviews/issues) in this repository if you find a bug or have questions about the content.

For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## Contributing
If you wish to contribute code, offer fixes or improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## License
Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSES/Apache-2.0.txt) file.
