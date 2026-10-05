#!/bin/bash
# Creates the Docker volumes and networks that docker-compose.yml declares as
# `external`. Safe to run any number of times: anything that already exists
# is left exactly as it is (existing data is never touched).
#   bash docker/setup-volumes.sh
set -euo pipefail

for volume in darshak-bhatt-db-data darshak-bhatt-app-uploads darshak-bhatt-nginx-certs; do
  if docker volume inspect "$volume" > /dev/null 2>&1; then
    echo "[setup] volume  $volume: exists, kept"
  else
    docker volume create "$volume" > /dev/null
    echo "[setup] volume  $volume: created"
  fi
done

ensure_network() {
  local name="$1"; shift
  if docker network inspect "$name" > /dev/null 2>&1; then
    echo "[setup] network $name: exists, kept"
  else
    docker network create "$@" "$name" > /dev/null
    echo "[setup] network $name: created"
  fi
}
ensure_network darshak-bhatt-frontend --driver bridge
ensure_network darshak-bhatt-backend --driver bridge --internal
