# syntax=docker/dockerfile:1.7

# =========================================================================
# Base image shared by all stages
# =========================================================================
FROM node:20-alpine AS base
# Prisma needs openssl; libc6-compat is required for some native modules on Alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# =========================================================================
# deps: install full dependency tree (cached separately from source changes)
# =========================================================================
FROM base AS deps
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

# =========================================================================
# builder: generate Prisma client and build the Next.js standalone bundle
# =========================================================================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# A placeholder DB URL is enough for `next build` — no DB connection happens
# at build time, but Prisma client generation and page collection need the
# env var to be present.
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

RUN npx prisma generate
RUN npm run build

# =========================================================================
# runner: minimal production image
# =========================================================================
FROM base AS runner
# Set by docker/deploy.sh; shown at /api/admin/version. Declared in this
# stage only so a new commit doesn't invalidate the build-stage cache.
ARG GIT_SHA=unknown
ARG BUILT_AT=unknown
ENV APP_COMMIT=$GIT_SHA
ENV APP_BUILT_AT=$BUILT_AT
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone server output + static assets + public files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Pre-create the uploads directory owned by nextjs so that when the
# "app-uploads" named volume mounts here, it inherits nextjs:nodejs
# ownership instead of defaulting to root (Docker copies the mountpoint's
# existing owner/permissions into a fresh, empty named volume).
RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public/uploads

# Prisma schema + migrations + generated client for runtime migrate/seed
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/tsx ./node_modules/tsx

COPY --chown=nextjs:nodejs docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>{if(r.status!==200)process.exit(1)}).catch(()=>process.exit(1))"

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "server.js"]
