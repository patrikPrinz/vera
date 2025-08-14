# Multi-stage Dockerfile pro monorepo s pnpm (server v packages/server)
# Targety: base -> deps -> builder -> dev (pro watch) -> runtime (prod)

# ---- base: společné nastavení ----
FROM node:22-alpine AS base
WORKDIR /app
# PNPM přes corepack (lockujeme verzi)
RUN corepack enable && corepack prepare pnpm@10 --activate
# Rychlejší buildy v CI
ENV CI=true

# ---- deps: instalace závislostí s maximální cache ----
FROM base AS deps
# Kopie jen souborů, které ovlivňují závislosti (cache-friendly)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./
# Kopie manifestů jen pro server (a případně jeho tsconfig)
COPY packages/server/package.json packages/server/tsconfig.json ./packages/server/
# Instalace workspace závislostí pouze pro server a jeho závislé balíčky
RUN pnpm install --filter server... --no-optional --no-frozen-lockfile

# ---- builder: produkční build artefaktů ----
FROM deps AS builder
# Zbytek zdrojáků až sem – ať se neinvaliduje cache deps při každé změně kódu
COPY packages/server/src ./packages/server/src
# Build serveru (očekává se, že vytvoří packages/server/dist)
RUN pnpm --filter server build

# ---- dev: prostředí pro vývoj s watch režimem ----
# (Používá stejné závislosti jako deps; zdrojáky mountneme v compose.)
FROM deps AS dev
ENV NODE_ENV=development
# Volitelně lze doplnit nodemon/tsx; ponecháváme na package.json skriptech
# Defaultní příkaz může být přepsán v docker-compose (pnpm --filter server dev)
CMD ["pnpm", "--filter", "server", "dev"]

# ---- runtime: minimální image pro běh v produkci ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Z bezpečnostních důvodů neběžíme jako root
# Zkopírujeme potřebné manifesty a lockfile kvůli instalaci prod deps
COPY --chown=node:node pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY --chown=node:node packages/server/package.json ./packages/server/

# PNPM (client) – použijeme corepack i zde
RUN corepack enable && corepack prepare pnpm@10 --activate
# Instalujeme pouze produkční závislosti serveru (+ jeho workspace závislosti)
RUN pnpm install --filter server... --prod --no-optional --no-frozen-lockfile
# Zkopírujeme build artefakty z builder stage
COPY --from=builder --chown=node:node /app/packages/server/dist ./packages/server/dist
# Volitelně: kopie dalších runtime souborů (např. public/, migrations, views)
# COPY --from=builder --chown=node:node /app/packages/server/public ./packages/server/public

EXPOSE 3000
# POZN.: uprav start path dle tvého projektu (např. index.js/server.js)
USER node
CMD ["node", "packages/server/dist/index.js"]