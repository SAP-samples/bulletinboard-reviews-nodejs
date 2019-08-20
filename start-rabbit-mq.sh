#!/bin/sh

set +e; existing_rabbitmq_container_name=$(docker ps -a -f name=rabbitmq-bulletinboard | grep rabbitmq-bulletinboard); set -e
if [ -z "$existing_rabbitmq_container_name" ]
then
    echo "Rabbitmq container doesn't exist, creating"
    docker create --name rabbitmq-bulletinboard -p 5672:5672 rabbitmq:3.7.17-alpine
fi

is_rabbitmq_container_running=`docker inspect -f '{{.State.Running}}' rabbitmq-bulletinboard`
if [ $is_rabbitmq_container_running = "false" ]
then
    echo "Starting Rabbitmq container"
    docker start rabbitmq-bulletinboard
else
    echo "Rabbitmq container already running"
fi
