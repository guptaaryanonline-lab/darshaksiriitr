#!/bin/sh
set -e

echo "[entrypoint] Waiting for database to accept connections..."
ATTEMPTS=0
MAX_ATTEMPTS=30
until node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$queryRaw\`SELECT 1\`.then(() => { process.exit(0); }).catch(() => { process.exit(1); });
" 2>/dev/null; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "$ATTEMPTS" -ge "$MAX_ATTEMPTS" ]; then
    echo "[entrypoint] Database not reachable after ${MAX_ATTEMPTS} attempts. Exiting."
    exit 1
  fi
  echo "[entrypoint] Database unavailable, retrying ($ATTEMPTS/$MAX_ATTEMPTS)..."
  sleep 2
done

echo "[entrypoint] Database is up. Running migrations..."
node_modules/.bin/prisma migrate deploy

if [ "$RUN_SEED_ON_BOOT" = "true" ]; then
  echo "[entrypoint] RUN_SEED_ON_BOOT=true, seeding database..."
  node_modules/.bin/tsx prisma/seed.ts
fi

echo "[entrypoint] Starting application..."
exec "$@"
