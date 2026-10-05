#!/bin/bash
# Pull-based auto deploy, run every 2 minutes by the systemd timer that
# docker/install-auto-deploy.sh installs. The server only makes an outgoing
# request to GitHub (like `git pull`), so it works behind the institute
# firewall that blocks GitHub Actions from reaching the server over SSH.
set -euo pipefail
cd "$(dirname "$0")/.."

exec 9> /tmp/rishi-deploy.lock
flock -n 9 || exit 0   # a deploy is already running

git fetch -q origin main
remote="$(git rev-parse origin/main)"

# Already deployed, or this exact commit already failed (wait for a new push).
[ "$(git rev-parse HEAD)" = "$remote" ] && exit 0
[ -f .deploy-failed ] && [ "$(cat .deploy-failed)" = "$remote" ] && exit 0

echo "[auto-deploy] new commit $(git rev-parse --short "$remote"), deploying"
RISHI_DEPLOY_LOCKED=1 bash docker/deploy.sh
