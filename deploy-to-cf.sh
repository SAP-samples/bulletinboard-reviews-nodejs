#!/bin/sh
cf target -o cloudrefapp -s bootcamp-team-X
cf create-service postgresql v9.6-dev postgres-bulletinboard-reviews
cf push -n bulletinboard-reviews
