#!/bin/bash
# Tries to recover content rows that were deleted from the database (e.g. by
# the old seed script, which wiped every content table on each restart).
#
# Run on the server from the repo directory:
#   bash docker/recover-deleted-rows.sh            # all content tables
#   bash docker/recover-deleted-rows.sh Student    # just one table
#
# How it works: Postgres doesn't erase deleted rows right away — it marks
# them dead, and on small tables they often stay on disk for a long time.
#   1. Take a physical snapshot of the live database (no downtime). It is
#      saved as recovery/<timestamp>/db-snapshot.tar.gz — keep that file.
#   2. In a throwaway container, start a private copy of that snapshot with
#      autovacuum off and read the dead rows with the pg_dirtyread extension.
#   3. Write <Table>-deleted-rows.csv (structured) and <Table>-raw-text.txt
#      (every readable string in the table file — a fallback that can show
#      names/text even when the structured read finds nothing).
# The live database is only read, never modified.
#
# On a server that doesn't have these scripts yet (run BEFORE deploying,
# since a deploy writes to the database and can overwrite deleted rows):
#   cd ~/app && git fetch origin main
#   for f in recover-deleted-rows.sh recover-inner.sh; do git show origin/main:docker/$f > /tmp/$f; done
#   APP_DIR="$PWD" bash /tmp/recover-deleted-rows.sh
set -euo pipefail

main() {
  local here
  here="$(cd "$(dirname "$0")" && pwd)"
  cd "${APP_DIR:-$here/..}"
  local env_file="${ENV_FILE:-.env.production}"
  [ -f "$env_file" ] || env_file=".env.local"
  local compose=(docker compose --env-file "$env_file")
  local tables="${*:-Student Project Research Publication Goal Course}"
  local out
  out="recovery/$(date +%F-%H%M%S)"
  mkdir -p "$out"

  local creds pg_user pg_db
  creds="$("${compose[@]}" exec -T db sh -c 'echo "$POSTGRES_USER $POSTGRES_DB"')"
  pg_user="${creds% *}"
  pg_db="${creds#* }"

  echo "[recover] 1/2 Taking a physical snapshot of the live database (no downtime)..."
  "${compose[@]}" exec -T db sh -c "rm -rf /tmp/rishi-snapshot && pg_basebackup -U '$pg_user' -D /tmp/rishi-snapshot -Fp -X fetch -c fast"
  "${compose[@]}" exec -T db tar czf - -C /tmp rishi-snapshot > "$out/db-snapshot.tar.gz"
  "${compose[@]}" exec -T db rm -rf /tmp/rishi-snapshot
  echo "[recover]     saved $out/db-snapshot.tar.gz ($(du -h "$out/db-snapshot.tar.gz" | cut -f1)) — keep this file."

  echo "[recover] 2/2 Reading deleted rows from the snapshot in a throwaway container..."
  docker run --rm -i \
    -v "$(pwd)/$out:/out" \
    -e PGUSER="$pg_user" -e PGDATABASE="$pg_db" -e TABLES="$tables" \
    postgres:16-alpine sh -s < "$here/recover-inner.sh"

  echo
  echo "[recover] Done. Results in $out/:"
  ls -la "$out"
}

main "$@"; exit $?
