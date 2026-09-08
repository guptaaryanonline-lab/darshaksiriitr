#!/bin/sh
# Fully automatic certificate lifecycle:
#  - Does nothing if DOMAIN isn't set (HTTP-only mode, e.g. IP-only access).
#  - Obtains a certificate on first run once DOMAIN + CERTBOT_EMAIL are set.
#  - Renews it automatically twice a day for as long as the stack runs.
set -e

if [ -z "$DOMAIN" ]; then
  echo "[certbot] DOMAIN is not set — skipping certificate issuance."
  echo "[certbot] Set DOMAIN and CERTBOT_EMAIL in your env file once you have a domain pointed at this server, then re-run 'docker compose up -d certbot'."
  # Stay alive so `docker compose up` doesn't report this container as
  # exited/failed; just idle until the stack is recreated with a domain.
  exec tail -f /dev/null
fi

LIVE_DIR="/etc/letsencrypt/live/${DOMAIN}"

if [ ! -f "$LIVE_DIR/fullchain.pem" ]; then
  echo "[certbot] No certificate found for ${DOMAIN}. Requesting one via HTTP-01..."
  # Retry loop: nginx needs a few seconds to come up and start serving
  # /.well-known/acme-challenge/ before this can succeed.
  ATTEMPTS=0
  MAX_ATTEMPTS=10
  until certbot certonly \
      --webroot -w /var/www/certbot \
      -d "$DOMAIN" \
      --email "${CERTBOT_EMAIL:-admin@$DOMAIN}" \
      --agree-tos --non-interactive --no-eff-email; do
    ATTEMPTS=$((ATTEMPTS + 1))
    if [ "$ATTEMPTS" -ge "$MAX_ATTEMPTS" ]; then
      echo "[certbot] Failed to obtain certificate after ${MAX_ATTEMPTS} attempts. Will keep retrying on the normal renewal loop."
      break
    fi
    echo "[certbot] Attempt ${ATTEMPTS}/${MAX_ATTEMPTS} failed, retrying in 10s..."
    sleep 10
  done
else
  echo "[certbot] Existing certificate found for ${DOMAIN}."
fi

echo "[certbot] Entering renewal loop (checks every 12h)."
while true; do
  certbot renew --webroot -w /var/www/certbot --quiet || echo "[certbot] Renewal check failed, will retry next cycle."
  sleep 12h
done
