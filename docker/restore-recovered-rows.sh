#!/bin/bash
# Puts rows found by docker/recover-deleted-rows.sh back into the database.
#
#   bash docker/restore-recovered-rows.sh recovery/<time>/Student-deleted-rows.csv           # preview only
#   bash docker/restore-recovered-rows.sh recovery/<time>/Student-deleted-rows.csv --apply   # restore
#
# Only restores rows that are missing today: skips placeholder/sample rows,
# rows whose id or name/title already exists, and older versions of the same
# row (keeps the newest). With --apply it backs up the database first.
set -euo pipefail

main() {
  cd "$(dirname "$0")/.."
  local csv="${1:?usage: restore-recovered-rows.sh <Table-deleted-rows.csv> [--apply]}"
  local mode="${2:-preview}"
  local env_file="${ENV_FILE:-.env.production}"
  [ -f "$env_file" ] || env_file=".env.local"
  local compose=(docker compose --env-file "$env_file")
  [ -f "$csv" ] || { echo "[restore] $csv not found"; exit 1; }

  local table key placeholders="''"
  table="$(basename "$csv" -deleted-rows.csv)"
  case "$table" in
    Student)
      key=name
      placeholders="'rishi lab scholar','m.tech research student','rishi lab alumnus','m.tech alumnus'"
      ;;
    Course) key=code ;;
    Project | Research | Publication | Goal) key=title ;;
    *) echo "[restore] Unsupported table: $table"; exit 1 ;;
  esac

  local finish="rollback"
  if [ "$mode" = "--apply" ]; then
    finish="commit"
    mkdir -p backups
    local backup="backups/pre-restore-$(date +%F-%H%M%S).sql.gz"
    "${compose[@]}" exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > "$backup"
    echo "[restore] Backed up current database to $backup"
  fi

  "${compose[@]}" cp "$csv" db:/tmp/restore.csv > /dev/null 2>&1
  "${compose[@]}" exec -T db sh -c 'psql -X -q -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' <<SQL
begin;
create temp table stage (dead boolean, like "$table");
\copy stage from '/tmp/restore.csv' with csv header
alter table stage drop column dead;

-- newest version of each deleted row
create temp table candidates as
  select distinct on (lower("$key")) * from stage order by lower("$key"), "updatedAt" desc;
delete from candidates where lower("$key") in ($placeholders);
delete from candidates c
  where exists (select 1 from "$table" t where t.id = c.id or lower(t."$key") = lower(c."$key"));

\echo
\echo '[restore] Rows that would be restored into $table:'
select "$key", "createdAt"::date as created from candidates order by "createdAt";

insert into "$table" select * from candidates;
$finish;
SQL
  "${compose[@]}" exec -T db rm -f /tmp/restore.csv

  if [ "$mode" = "--apply" ]; then
    echo "[restore] Restored. Check the site, then re-run for the other tables if needed."
  else
    echo "[restore] Preview only — nothing was changed. Add --apply to restore these rows."
  fi
}

main "$@"; exit $?
