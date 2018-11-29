#!/bin/sh
cf target -o cloudcourse -s cloud-native-bootcamp
cf create-service postgresql v9.6-dev postgres-bulletinboard-reviews
cf push
