#!/bin/sh
# Runs inside a throwaway postgres:16-alpine container started by
# docker/recover-deleted-rows.sh. Works only on the snapshot copy in /out.
set -eu

PGDATA=/tmp/pg/rishi-snapshot
export PGHOST=/tmp

mkdir -p /tmp/pg
tar xzf /out/db-snapshot.tar.gz -C /tmp/pg
chown -R postgres:postgres /tmp/pg
chmod 700 "$PGDATA"
rm -f "$PGDATA/postmaster.pid"

# Private instance: no network listener, autovacuum off so dead rows stay put.
su-exec postgres pg_ctl -D "$PGDATA" -l /tmp/pg.log -w \
  -o "-c autovacuum=off -c listen_addresses='' -c unix_socket_directories=/tmp" start > /dev/null

q() { psql -X -v ON_ERROR_STOP=1 -tAc "$1"; }

# Raw-text fallback first, before anything reads the tables.
for t in $TABLES; do
  path="$(q "select pg_relation_filepath('\"$t\"')" 2> /dev/null || true)"
  if [ -n "$path" ] && [ -f "$PGDATA/$path" ]; then
    cat "$PGDATA/$path"* | strings -n 4 > "/out/$t-raw-text.txt"
    echo "[recover]     $t: raw text -> $t-raw-text.txt ($(wc -l < "/out/$t-raw-text.txt") lines)"
  fi
done

# Structured recovery with pg_dirtyread (built from source; needs internet).
if apk add --no-cache build-base git > /tmp/apk.log 2>&1 \
  && git clone -q --depth 1 https://github.com/df7cb/pg_dirtyread /tmp/pg_dirtyread > /tmp/git.log 2>&1 \
  && make -s -C /tmp/pg_dirtyread with_llvm=no install > /tmp/make.log 2>&1; then
  q "create extension if not exists pg_dirtyread" > /dev/null
  for t in $TABLES; do
    cols="$(q "select string_agg(quote_ident(attname) || ' ' || format_type(atttypid, atttypmod), ', ' order by attnum)
               from pg_attribute where attrelid = '\"$t\"'::regclass and attnum > 0 and not attisdropped" 2> /dev/null || true)"
    [ -n "$cols" ] || continue
    if psql -X -v ON_ERROR_STOP=1 -q -c "\copy (select * from pg_dirtyread('\"$t\"') as x(dead boolean, $cols) where dead) to '/out/$t-deleted-rows.csv' with csv header" 2> "/tmp/$t.err"; then
      rows=$(($(wc -l < "/out/$t-deleted-rows.csv") - 1))
      echo "[recover]     $t: $rows deleted row versions -> $t-deleted-rows.csv"
    else
      echo "[recover]     $t: structured read failed ($(head -1 "/tmp/$t.err")); use $t-raw-text.txt"
    fi
  done
else
  echo "[recover]     Could not build pg_dirtyread (no internet in the container?). Only raw-text files were produced."
fi

su-exec postgres pg_ctl -D "$PGDATA" -w stop > /dev/null
