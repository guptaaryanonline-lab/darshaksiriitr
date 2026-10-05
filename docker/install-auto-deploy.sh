#!/bin/bash
# One-time setup on the EC2 instance (run from the repo directory):
#   bash docker/install-auto-deploy.sh
# Installs a systemd timer that checks GitHub every 2 minutes and deploys
# new pushes to main via docker/deploy.sh. Logs: journalctl -u rishi-deploy -f
set -euo pipefail
cd "$(dirname "$0")/.."
APP_DIR="$(pwd)"
RUN_USER="$(id -un)"

sudo tee /etc/systemd/system/rishi-deploy.service > /dev/null <<EOF
[Unit]
Description=Deploy RISHI Lab site when main changes
After=network-online.target docker.service

[Service]
Type=oneshot
User=$RUN_USER
WorkingDirectory=$APP_DIR
ExecStart=/bin/bash $APP_DIR/docker/auto-deploy.sh
EOF

sudo tee /etc/systemd/system/rishi-deploy.timer > /dev/null <<EOF
[Unit]
Description=Check for new RISHI Lab commits every 2 minutes

[Timer]
OnBootSec=2min
OnUnitActiveSec=2min

[Install]
WantedBy=timers.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now rishi-deploy.timer
echo "Auto-deploy installed. Watch it with: journalctl -u rishi-deploy -f"
