#!/bin/sh
# Runs inside the db-backup container: one compressed pg_dump per day into
# /backups (the ./backups folder on the server), keeping BACKUP_KEEP_DAYS days.
set -eu
KEEP_DAYS="${BACKUP_KEEP_DAYS:-14}"

until pg_isready -q; do sleep 5; done

while true; do
  file="/backups/daily-$(date +%F).sql.gz"
  if pg_dump | gzip > "$file.tmp"; then
    mv "$file.tmp" "$file"
    echo "[db-backup] wrote $file ($(wc -c < "$file") bytes)"
  else
    rm -f "$file.tmp"
    echo "[db-backup] backup FAILED, will retry in 1 hour"
    sleep 3600
    continue
  fi
  find /backups -name 'daily-*.sql.gz' -mtime +"$KEEP_DAYS" -delete
  sleep 86400
done
