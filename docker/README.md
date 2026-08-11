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
- **`backend` network** — only `app` and `db` attach to it. Postgres publishes
  no port to the host, so it is unreachable from outside Docker entirely.
- **Named volumes** (`docker volume ls`) persist data independently of
  container lifecycle — recreating, restarting, or upgrading a container
  never touches this data:
  - `darshak-bhatt-db-data` — Postgres data directory. This is what makes
    your database survive `docker compose down`, an instance reboot, or a
    `git pull` + rebuild. It is only destroyed by an explicit
    `docker compose down -v` or `docker volume rm`.
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

# production (on the EC2 instance)
docker compose --env-file .env.production up -d
```

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

docker compose --env-file .env.production build
docker compose --env-file .env.production up -d
docker compose logs -f app   # watch migrations run, then the server start
```

On first boot the `app` container waits for Postgres, runs
`prisma migrate deploy`, and starts the server. To also seed the initial
admin user + sample content on that first boot, set `RUN_SEED_ON_BOOT=true`
in `.env.production` before `up -d`, then **set it back to `false`** and
run `up -d app` again — the seed script deletes and re-inserts all
Project/Research/Patent/Student/Goal/Course rows every time it runs, so
leaving it `true` will silently wipe content you add later.

Visit `http://13.201.172.206/` to confirm the site loads, and
`http://13.201.172.206/api/health` to confirm the app can reach the
database (`{"status":"ok"}`).

## 4. HTTPS (required before relying on the admin panel)

The admin login cookie is marked `Secure` in production, so **admin login
will not work over plain HTTP** — the browser silently refuses to store the
cookie. Put a real domain + TLS in front before using `/admin`:

1. Point a DNS A record at `13.201.172.206`.
2. Get a certificate with certbot in standalone mode, writing into the
   `darshak-bhatt-nginx-certs` volume (stop `nginx` first so port 80 is free):
   ```bash
   docker compose stop nginx
   docker run --rm \
     -v darshak-bhatt-nginx-certs:/etc/letsencrypt \
     -v darshak-bhatt-certbot-webroot:/var/www/certbot \
     -p 80:80 \
     certbot/certbot certonly --standalone \
     -d your-domain.example.com --agree-tos -m you@example.com --non-interactive
   ```
3. Uncomment the HTTPS `server` block in
   [`docker/nginx/default.conf`](nginx/default.conf), update `server_name`,
   then `docker compose --env-file .env.production up -d nginx`.
4. Set up renewal via cron (`certbot renew` on the same volumes) every ~60
   days.

Until HTTPS is set up, the public pages work fine over HTTP — only the
admin login is blocked.

## Operations

```bash
# Update to a new release
git pull
docker compose --env-file .env.production build app
docker compose --env-file .env.production up -d app

# Tail logs
docker compose logs -f app
docker compose logs -f db

# Back up the database
docker compose exec db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > backup-$(date +%F).sql.gz

# Back up uploaded images
docker run --rm -v darshak-bhatt-app-uploads:/data -v "$PWD":/backup alpine \
  tar czf /backup/uploads-$(date +%F).tar.gz -C /data .

# Restore database
gunzip -c backup-2026-08-11.sql.gz | docker compose exec -T db psql -U "$POSTGRES_USER" "$POSTGRES_DB"

# Full stack down (data survives, volumes are NOT removed)
docker compose down

# Danger: also deletes the Postgres + uploads volumes
docker compose down -v
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
