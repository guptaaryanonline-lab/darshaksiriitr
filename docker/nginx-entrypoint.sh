#!/bin/sh
# Renders nginx's config based on whether a domain + certificate are
# available, then keeps checking in the background so nginx picks up a
# certificate the moment certbot issues one — no manual restart needed.
set -e

CONF_DIR=/etc/nginx/conf.d
TEMPLATE_DIR=/etc/nginx/conf-templates
CERT_LIVE_DIR="/etc/nginx/certs/live/${DOMAIN:-__no_domain__}"

# The stock nginx image ships its own conf.d/default.conf with
# `server_name localhost;`, which wins over our catch-all `server_name _;`
# block for requests sent with a "Host: localhost" header — remove it so
# only our rendered config is ever in effect.
rm -f "$CONF_DIR/default.conf"

render_config() {
  # Always serve plain HTTP (and the ACME challenge path).
  envsubst '${DOMAIN}' < "$TEMPLATE_DIR/http.conf.template" > "$CONF_DIR/http.conf"

  if [ -n "$DOMAIN" ] && [ -f "$CERT_LIVE_DIR/fullchain.pem" ] && [ -f "$CERT_LIVE_DIR/privkey.pem" ]; then
    if [ ! -f "$CONF_DIR/https.conf" ]; then
      echo "[nginx-entrypoint] Certificate found for ${DOMAIN} — enabling HTTPS."
    fi
    envsubst '${DOMAIN}' < "$TEMPLATE_DIR/https.conf.template" > "$CONF_DIR/https.conf"
  else
    if [ -f "$CONF_DIR/https.conf" ]; then
      echo "[nginx-entrypoint] Certificate for ${DOMAIN} no longer present — disabling HTTPS."
    fi
    rm -f "$CONF_DIR/https.conf"
  fi
}

render_config

# Watch for the certificate appearing/renewing (certbot writes into the
# same volume) and reload nginx without dropping connections.
watch_and_reload() {
  while true; do
    sleep 30
    prev_hash=""
    if [ -f "$CERT_LIVE_DIR/fullchain.pem" ]; then
      prev_hash=$(sha256sum "$CERT_LIVE_DIR/fullchain.pem" 2>/dev/null | cut -d' ' -f1)
    fi
    render_config
    new_hash=""
    if [ -f "$CERT_LIVE_DIR/fullchain.pem" ]; then
      new_hash=$(sha256sum "$CERT_LIVE_DIR/fullchain.pem" 2>/dev/null | cut -d' ' -f1)
    fi
    if [ "$prev_hash" != "$new_hash" ] || [ ! -f "$CONF_DIR/.rendered" ]; then
      touch "$CONF_DIR/.rendered"
      echo "[nginx-entrypoint] Config changed, reloading nginx..."
      nginx -s reload 2>/dev/null || true
    fi
  done
}

watch_and_reload &

exec nginx -g "daemon off;"
