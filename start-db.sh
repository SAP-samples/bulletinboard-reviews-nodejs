#!/bin/sh -e

set +e; existing_db_container_name=$(docker ps -a -f name=postgres-bulletinboard-reviews | grep postgres-bulletinboard-reviews); set -e
if [ -z "$existing_db_container_name" ]
then
    echo "DB container doesn't exist, creating"
    docker run -d -p 6543:5432 --name postgres-bulletinboard-reviews -e POSTGRES_HOST_AUTH_METHOD=trust postgres:9.6-alpine
    docker exec -t postgres-bulletinboard-reviews sh -c "until pg_isready -q -U postgres -h localhost; do echo waiting for database; sleep 2; done;"
    docker exec -t postgres-bulletinboard-reviews /usr/local/bin/psql -q -U postgres -h localhost -c "CREATE DATABASE testdb"
    echo "DB container running"
else
    is_db_container_running=`docker inspect -f '{{.State.Running}}' postgres-bulletinboard-reviews`
    if [ $is_db_container_running = "false" ]
    then
        echo "Starting DB container"
        docker start postgres-bulletinboard-reviews
    else
        echo "DB container already running"
    fi
fi