#!/usr/bin/env bash

export VCAP_SERVICES='{"postgresql":[{"credentials":{"uri":"postgres://postgres@localhost:6543/postgres"}}]}'
export PORT='9090'

npm run start