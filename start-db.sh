#!/bin/sh -e

set +e; existing_db_container_name=$(docker ps -a -f name=postgres-bulletinboard-reviews | grep postgres-bulletinboard-reviews); set -e
if [ -z "$existing_db_container_name" ]
then
    echo "DB container doesn't exist, creating"
    docker create -p 6543:5432 --name postgres-bulletinboard-reviews -e POSTGRES_HOST_AUTH_METHOD=trust postgres:9.6-alpine
fi

is_db_container_running=`docker inspect -f '{{.State.Running}}' postgres-bulletinboard-reviews`
if [ $is_db_container_running = "false" ]
then
    echo "Starting DB container"
    docker start postgres-bulletinboard-reviews
else
    echo "DB container already running"
fi
