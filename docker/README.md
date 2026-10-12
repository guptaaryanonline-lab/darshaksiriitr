# Docker deployment (AWS EC2 t3a.large, Amazon Linux)

This stack runs three containers behind a private Docker network:

```
                 ┌─────────────────────────────────────────────┐
 Internet ──80/443──▶  nginx (frontend network)                │
                 │        │                                    │
                 │        ▼                                    │
                 │      app (Next.js, frontend + backend nets) │
                 │        │                                    │
                 │        ▼                                    │
                 │      db (Postgres, backend network only)    │
                 └─────────────────────────────────────────────┘
```

- **`frontend` network** — only `nginx` and `app` attach to it.
- **`backend` network** — only `app`, `db` and `db-backup` attach to it. It is
  created with `--internal` (no internet access), and Postgres publishes no
  port to the host, so it is unreachable from outside Docker entirely.
- **External named volumes** (`docker volume ls`) persist data independently
  of container lifecycle — recreating, restarting, or upgrading a container
  never touches this data:
  - `darshak-bhatt-db-data` — Postgres data directory. This is what makes
    your database survive `docker compose down` (even `down -v`), an
    instance reboot, or a rebuild. It is only destroyed by an explicit
    `docker volume rm darshak-bhatt-db-data`.
  - `darshak-bhatt-app-uploads` — images uploaded through the admin panel
    (`/api/admin/upload`) are written straight to disk under
    `public/uploads`, which this volume backs. No external service
    (Cloudinary/S3) is used — everything lives on the instance's own disk.
  - `darshak-bhatt-nginx-certs` / `darshak-bhatt-certbot-webroot` — TLS
    certificates and ACME challenge files, once you enable HTTPS.

## Environment files

Two env files ship in the repo (both git-ignored, fill in real secrets only
on disk, never commit them):

- **`.env.local`** — localhost / local Docker Compose development. Weak
  placeholder secrets are fine here.
- **`.env.production`** — the AWS EC2 instance. Replace every
  `REPLACE_WITH_...` placeholder with a real, strong value before starting
  the stack. Generate secrets with:
  ```bash
  openssl rand -base64 32
  ```

Point `docker compose` at whichever file applies with `--env-file`:

```bash
# local
docker compose --env-file .env.local up -d

# production (on the EC2 instance) — use docker/deploy.sh instead, see below
docker compose --env-file .env.production up -d
```

### `npm run dev` on your own machine

`npm run dev` needs a `DATABASE_URL`. To let it use the local Docker
database (same data as the Docker site at `http://localhost`), create a
**git-ignored** `docker-compose.override.yml` next to `docker-compose.yml`:

```yaml
services:
  db:
    ports:
      - "127.0.0.1:5433:5432"
    networks:
      - backend
      - dev-db-access
networks:
  dev-db-access:
    name: darshak-bhatt-dev-db-access
```

and add to `.env.local`:

```bash
DATABASE_URL=postgresql://app:localdevpassword@127.0.0.1:5433/app?schema=public
```

Then `docker compose --env-file .env.local up -d db` once. Never create this
override on the server — there the database must stay unreachable. (On
Windows with Docker inside WSL, keep a WSL terminal open; when WSL goes idle it
stops Docker, and `npm run dev` then can't reach the database.)

## This deployment's instance

- Instance ID: `i-03fb206ad5664fe80`
- Type: `t3a.large` (2 vCPU / 8 GiB RAM — comfortable for this stack)
- Disk: 60 GiB
- OS: Amazon Linux
- Public IP: `13.201.172.206`
- SSH: `ssh ec2-user@13.201.172.206`

## 1. Security group

Allow inbound `22` (SSH, restrict to your IP), `80`, `443` on the instance's
security group. Everything else (Postgres, the app's internal port 3000)
stays off the internet by design — only nginx is exposed.

## 2. Install Docker + Compose plugin (Amazon Linux)

```bash
sudo dnf update -y
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
DOCKER_COMPOSE_VERSION=v2.29.7
sudo mkdir -p /usr/libexec/docker/cli-plugins
sudo curl -SL "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-linux-x86_64" \
  -o /usr/libexec/docker/cli-plugins/docker-compose
sudo chmod +x /usr/libexec/docker/cli-plugins/docker-compose
```

Log out/in (or `newgrp docker`) so your shell picks up the `docker` group.

## 3. Deploy the app

```bash
git clone <your-repo-url> app && cd app
nano .env.production   # fill in POSTGRES_PASSWORD, AUTH_SECRET,
                        # ADMIN_EMAIL, ADMIN_PASSWORD with real values
bash docker/deploy.sh   # creates volumes/networks, builds, starts, health-checks,
                        # and installs auto-deploy for every later push
```

On first boot the `app` container waits for Postgres, runs
`prisma migrate deploy`, creates the admin account, and starts the server.
Sections that are completely empty get starter content; **the seed never
deletes or changes existing data** (CI re-checks this on every push).

### Deploying updates

**Never deploy by hand with `git pull` + `docker compose up`.** Use:

```bash
bash docker/deploy.sh
```

On a server that doesn't have `docker/deploy.sh` yet, run it once straight
from GitHub instead (don't `git pull` first — this way the version that is
live right now stays the automatic-rollback target):

```bash
cd ~/app && git fetch origin main \
  && git show origin/main:docker/deploy.sh > /tmp/rishi-deploy.sh \
  && APP_DIR="$PWD" bash /tmp/rishi-deploy.sh
```

It (1) makes sure the external volumes/networks exist, (2) forces
`RUN_SEED_ON_BOOT=false`, (3) backs up the database and **aborts if the
backup fails**, (4) updates the code like `git pull --ff-only` (local edits
on the server are kept), (5) builds — if the build fails the current site
keeps running — and (6) restarts and health-checks, **rolling back
automatically** if the new version is unhealthy.

With `docker/install-auto-deploy.sh` installed, the server checks GitHub every
2 minutes and runs `deploy.sh` for each new commit on `main`. It only makes
outgoing requests (like `git pull`), so it works behind the institute
firewall. Logs: `journalctl -u rishi-deploy -f`. A commit that fails to build
is skipped until the next push.

GitHub Actions can't deploy (the firewall blocks inbound SSH), so
[`ci.yml`](../.github/workflows/ci.yml) is the safety net instead: on every
push it builds the app, applies all migrations to a fresh database, and checks
that running the seed against existing data changes nothing. **A red ❌ on a
commit means: don't deploy it.**

### Where the data lives (persistence)

| What | Docker volume | Protection |
|---|---|---|
| Database | `darshak-bhatt-db-data` | `external` + daily & pre-deploy backups |
| Uploaded images | `darshak-bhatt-app-uploads` | `external` |
| TLS certificates | `darshak-bhatt-nginx-certs` | `external` |

`external` volumes are never created, replaced or removed by Docker Compose —
not by `up`, `down`, or even `docker compose down -v`. The only way to lose
them is an explicit `docker volume rm <name>`; don't. Networks are fixed too:
`darshak-bhatt-frontend` (nginx, app, certbot) and the internal
`darshak-bhatt-backend` (app, db, db-backup — no internet access).

Backups are written to `~/app/backups/`: `daily-YYYY-MM-DD.sql.gz` (kept 14
days) and `pre-deploy-*.sql.gz` (last 30). Copy them off the server now and
then, and enable EBS snapshots for the instance in the AWS console.

Restore a backup:
```bash
gunzip -c backups/daily-2026-10-05.sql.gz | docker compose --env-file .env.production exec -T db \
  sh -c 'psql -U "$POSTGRES_USER" "$POSTGRES_DB"'
```

### One time: moving the live server to this setup

One command on the server does everything — switches `RUN_SEED_ON_BOOT`
off, backs up the database, snapshots rows the old seed deleted into
`recovery/` (only when coming from that old version), deploys with rollback,
and installs the auto-deploy timer so every later push deploys itself:

```bash
cd ~/app && git fetch origin main \
  && git show origin/main:docker/deploy.sh > /tmp/rishi-deploy.sh \
  && APP_DIR="$PWD" bash /tmp/rishi-deploy.sh
```

Then review `recovery/<time>/*.csv` and restore what's missing (preview first):

```bash
bash docker/restore-recovered-rows.sh recovery/<time>/Student-deleted-rows.csv
bash docker/restore-recovered-rows.sh recovery/<time>/Student-deleted-rows.csv --apply
```

The first deploy moves the containers onto the new fixed networks, so expect
about a minute of downtime once.

### Recovering deleted rows (no backup)

```bash
bash docker/recover-deleted-rows.sh                       # snapshot + read deleted rows
bash docker/restore-recovered-rows.sh recovery/<time>/Student-deleted-rows.csv          # preview
bash docker/restore-recovered-rows.sh recovery/<time>/Student-deleted-rows.csv --apply  # restore
```
Deleted Postgres rows usually stay on disk until vacuum reuses the space, so
run this as soon as possible after data goes missing. The live database is
only read; restoring skips placeholders and anything that already exists.

## 4. HTTPS (required before relying on the admin panel)

The admin login cookie is marked `Secure` in production, so **admin login
will not work over plain HTTP** — the browser silently refuses to store the
cookie. HTTPS is fully automatic — no manual certbot commands, no editing
nginx config by hand, and it self-renews for as long as the stack runs:

1. Point a DNS A record for your domain at `13.201.172.206` and wait for it
   to resolve (`dig +short your-domain.example.com` should return the IP).
2. Fill in `DOMAIN` and `CERTBOT_EMAIL` in `.env.production`:
   ```bash
   DOMAIN=your-domain.example.com
   CERTBOT_EMAIL=you@example.com
   ```
3. Restart the stack so the new env vars take effect:
   ```bash
   docker compose --env-file .env.production up -d
   ```

What happens automatically from here:
- The `certbot` container requests a certificate for `DOMAIN` via the
  HTTP-01 challenge (served through `nginx`'s always-on port 80), retrying
  every 10s for up to ~100s while nginx finishes starting.
- The `nginx` container watches for that certificate to appear and reloads
  itself within ~30s of it showing up — no restart needed, no downtime.
- Once live, `http://your-domain.example.com` redirects to
  `https://your-domain.example.com`; the bare IP keeps serving HTTP only
  (Let's Encrypt cannot issue a certificate for a bare IP address).
- `certbot` renews the certificate automatically every 12 hours (Let's
  Encrypt certs are valid 90 days; certbot only actually renews when a cert
  is within 30 days of expiry), and `nginx` reloads again automatically
  when it does.

Leaving `DOMAIN` blank keeps the whole stack HTTP-only (fine for IP-only
access, or before you've set up a domain) — the `certbot` container just
idles in that case instead of failing. Until HTTPS is set up, the public
pages work fine over HTTP — only the admin login is blocked.

**Troubleshooting:**
```bash
docker compose logs -f certbot   # certificate issuance/renewal status
docker compose logs -f nginx     # config render + reload status
```
The most common failure is DNS not yet resolving to this instance, or the
security group not allowing inbound `80` — the HTTP-01 challenge needs both.

## Operations

```bash
# Update to a new release (backup -> pull -> build -> restart -> health check)
bash docker/deploy.sh

# Tail logs
docker compose logs -f app
docker compose logs -f db
journalctl -u rishi-deploy -f      # auto-deploy runs

# Back up the database right now (daily backups also run automatically)
docker compose --env-file .env.production exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' | gzip > backups/manual-$(date +%F).sql.gz

# Back up uploaded images
docker run --rm -v darshak-bhatt-app-uploads:/data -v "$PWD":/backup alpine \
  tar czf /backup/uploads-$(date +%F).tar.gz -C /data .

# Restore database
gunzip -c backup-2026-08-11.sql.gz | docker compose exec -T db psql -U "$POSTGRES_USER" "$POSTGRES_DB"

# Full stack down (data survives — the data volumes are external, so even
# `docker compose down -v` leaves them alone)
docker compose down

# The ONLY command that deletes the database. Don't.
# docker volume rm darshak-bhatt-db-data
```

## Resource notes for this instance

- `t3a.large` (8 GiB RAM, 2 vCPU) comfortably runs all three containers.
  Per-service memory/CPU caps are set in `docker-compose.yml`
  (`deploy.resources.limits`) so a runaway process in one container can't
  starve the others:
  - `db`: up to 1 CPU / 1 GiB
  - `app`: up to 1.5 CPU / 1.5 GiB
  - `nginx`: up to 0.5 CPU / 256 MiB
- Docker log rotation is enabled (`max-size: 10m`, `max-file: 3` per
  service) so container logs can't fill the 60 GiB disk over time.
- Uploaded images have no automatic size cap on disk beyond the 10MB
  per-file limit enforced in `src/lib/uploads.ts` — monitor disk usage
  (`df -h`) as the library grows.
