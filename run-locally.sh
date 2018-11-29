#!/bin/sh -e

if [ "$#" -ne 1 ]
then
  echo "Usage: run-locally.sh <script>"
  echo "<script> refers to one of the scripts defined in package.json"
  exit 1
fi

set +e; existing_db_container_name=$(docker ps -a -f name=postgres-bulletinboard-reviews | grep postgres-bulletinboard-reviews); set -e
if [ -z "$existing_db_container_name" ]
then
    echo "DB container doesn't exist, creating"
    docker create -p 6543:5432 --name postgres-bulletinboard-reviews postgres:9.6-alpine
fi

is_db_container_running=`docker inspect -f '{{.State.Running}}' postgres-bulletinboard-reviews`
if [ $is_db_container_running = "false" ]
then
    echo "Starting DB container"
    docker start postgres-bulletinboard-reviews
    sleep 3
fi

export VCAP_SERVICES='{"postgresql":[{"credentials":{"uri":"postgres://postgres@localhost:6543/postgres"}}]}'
export PORT='9090'
npm install
npm run $1
