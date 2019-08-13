#!/usr/bin/env bash

export VCAP_SERVICES='{"postgresql":[{"credentials":{"uri":"postgres://postgres@localhost:6543/postgres"}}]}'
export PORT='9090'

echo "Starting application server"
if [ "$1" = "debug" ]
  then npm run start:debug
  else npm run start
fi