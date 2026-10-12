#!/bin/bash
# Safe production deploy. Run on the EC2 instance from the repo directory:
#   bash docker/deploy.sh
# (docker/auto-deploy.sh runs this automatically after every push to main.)
#
#   1. force RUN_SEED_ON_BOOT=false — seeding is never needed on a live site
#   2. back up the database; the deploy ABORTS if the backup fails
#   3. update the code exactly like `git pull` (fast-forward only), so
#      server-side edits are never thrown away; make sure the external
#      volumes/networks exist (never recreated)
#   4. build; if the build fails, the current site simply keeps running
#   5. restart and wait for the health check; if the new version is
#      unhealthy, roll back to the previous version automatically
#   6. install the auto-deploy timer if it isn't installed yet, so after one
#      manual deploy every push to main deploys itself
#
# When upgrading from a version whose seed wiped the content tables, it also
# snapshots the deleted rows into recovery/ before the new version touches
# the database (see docker/recover-deleted-rows.sh).
#
# Data lives in external Docker volumes that Compose can't delete. Never run
# `docker volume rm darshak-bhatt-db-data` (that is the only way to lose it).
#
# First deploy on a server that doesn't have this script yet — run it straight
# from GitHub so the version currently live stays the rollback target:
#   cd ~/app && git fetch origin main && git show origin/main:docker/deploy.sh > /tmp/rishi-deploy.sh \
#     && APP_DIR="$PWD" bash /tmp/rishi-deploy.sh
#
# Everything is inside main() so bash reads the whole script before the code
# update can replace this file mid-run.
set -euo pipefail

main() {
  cd "${APP_DIR:-$(dirname "$0")/..}"
  local env_file="${ENV_FILE:-.env.production}"
  local compose=(docker compose --env-file "$env_file")

  [ -f "$env_file" ] || { echo "[deploy] $env_file not found in $(pwd)"; exit 1; }
  [ -d .git ] || { echo "[deploy] $(pwd) is not the app's git checkout"; exit 1; }

  # One deploy at a time (auto-deploy.sh already holds this lock when it calls us).
  if [ -z "${RISHI_DEPLOY_LOCKED:-}" ]; then
    exec 9> /tmp/rishi-deploy.lock
    flock -w 900 9 || { echo "[deploy] Another deploy is still running — try again later."; exit 1; }
  fi

  # 1. Never seed on boot in production — fixed in the file, and forced for
  #    this run even if it is also set in the server's shell environment.
  if grep -qE '^RUN_SEED_ON_BOOT=(true|1|yes)' "$env_file"; then
    sed -i -E 's/^RUN_SEED_ON_BOOT=.*/RUN_SEED_ON_BOOT=false/' "$env_file"
    echo "[deploy] RUN_SEED_ON_BOOT was on in $env_file — switched it off."
  fi
  export RUN_SEED_ON_BOOT=false

  # 2. Back up the database before touching anything.
  backup_database "${compose[@]}"

  # 3. Update the code (same as `git pull --ff-only`).
  local previous target
  previous="$(git rev-parse HEAD)"
  git fetch origin main
  if ! git merge --ff-only origin/main; then
    echo "[deploy] Could not fast-forward to origin/main (conflicting local edits on the server?). Nothing was changed."
    git status --short
    exit 1
  fi
  target="$(git rev-parse HEAD)"
  if [ "$previous" = "$target" ]; then
    echo "[deploy] Code already at $(git rev-parse --short HEAD); rebuilding anyway."
  fi

  # Leaving a version whose seed deleted every student/project/... on boot:
  # save the deleted rows still on disk before migrations write to the database.
  if git show "$previous:prisma/seed.ts" 2> /dev/null | grep -q 'deleteMany'; then
    echo "[deploy] The previous version's seed wiped content tables — saving deleted rows to recovery/ first."
    bash docker/recover-deleted-rows.sh || echo "[deploy] Recovery snapshot failed (deploy continues); see the output above."
  fi

  # Persistent volumes and networks (no-op when they exist; data is never touched).
  bash docker/setup-volumes.sh

  # 4. Build. A failed build leaves the running site untouched.
  export GIT_SHA="$target" BUILT_AT="$(date -u +%FT%TZ)"
  if ! "${compose[@]}" build app; then
    echo "[deploy] Build FAILED for $(git rev-parse --short "$target"). The current site is still running the previous version."
    git reset --keep "$previous"
    echo "$target" > .deploy-failed
    exit 1
  fi

  # 5. Restart and verify; roll back if the new version is unhealthy.
  "${compose[@]}" up -d --remove-orphans
  if wait_healthy "${compose[@]}"; then
    rm -f .deploy-failed
    docker image prune -f > /dev/null
    echo "[deploy] Healthy. Deployed $(git rev-parse --short HEAD)."
    ensure_auto_deploy || echo "[deploy] Could not install auto-deploy; run once: bash docker/install-auto-deploy.sh"
    return 0
  fi

  echo "[deploy] New version is unhealthy — rolling back to $(git rev-parse --short "$previous")."
  "${compose[@]}" logs --tail 40 app || true
  echo "$target" > .deploy-failed
  git reset --keep "$previous"
  export GIT_SHA="$previous" BUILT_AT="$(date -u +%FT%TZ)"
  "${compose[@]}" build app
  "${compose[@]}" up -d --remove-orphans
  wait_healthy "${compose[@]}" && echo "[deploy] Rolled back; site is up on the previous version."
  exit 1
}

backup_database() {
  local compose=("$@")
  mkdir -p backups
  if ! "${compose[@]}" ps --status running --services 2>/dev/null | grep -qx db; then
    echo "[deploy] Database not running yet (first deploy?) — skipping backup."
    return 0
  fi
  local file dump size
  file="pre-deploy-$(date +%F-%H%M%S).sql.gz"
  dump=(sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"')
  if [ -w backups ]; then
    "${compose[@]}" exec -T db "${dump[@]}" | gzip > "backups/$file"
  else
    "${compose[@]}" exec -T db "${dump[@]}" | gzip | "${compose[@]}" exec -T db-backup sh -c "cat > /backups/$file"
  fi
  size=$(wc -c < "backups/$file" 2>/dev/null || echo 0)
  if [ "$size" -lt 1024 ]; then
    echo "[deploy] Database backup looks empty ($size bytes) — aborting, nothing was changed."
    exit 1
  fi
  echo "[deploy] Database backed up to backups/$file ($size bytes)"
  { ls -1t backups/pre-deploy-*.sql.gz 2> /dev/null || true; } | tail -n +31 | xargs -r rm -f --
}

# GitHub can't reach the server, so the server pulls new commits itself via a
# systemd timer. Install it on the first deploy (needs passwordless sudo,
# which ec2-user has on Amazon Linux).
ensure_auto_deploy() {
  systemctl is-enabled --quiet rishi-deploy.timer 2> /dev/null && return 0
  if ! sudo -n true 2> /dev/null; then
    echo "[deploy] Auto-deploy is not installed and sudo needs a password — run once: bash docker/install-auto-deploy.sh"
    return 0
  fi
  bash docker/install-auto-deploy.sh
}

wait_healthy() {
  local compose=("$@")
  for _ in $(seq 1 40); do
    if "${compose[@]}" exec -T app node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" 2> /dev/null; then
      return 0
    fi
    sleep 3
  done
  return 1
}

main "$@"; exit $?
