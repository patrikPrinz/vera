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
COPY packages/frontend/package.json packages/frontend/tsconfig.json ./packages/frontend/
# Instalace workspace závislostí pouze pro server a jeho závislé balíčky
RUN pnpm install --filter frontend... --no-frozen-lockfile
# Copy package config files from root of the package (not needed for installing dependencies)
COPY packages/frontend/tailwind.config.cjs\
  packages/frontend/postcss.config.cjs\
  packages/frontend/vite.config.js\
  packages/frontend/index.html\
  ./packages/frontend/

# ---- builder: produkční build artefaktů ----
FROM deps AS builder
# Zbytek zdrojáků až sem – ať se neinvaliduje cache deps při každé změně kódu
COPY packages/frontend/src ./packages/frontend/src
COPY packages/shared-types ./packages/shared-types

# Build serveru (očekává se, že vytvoří packages/server/dist)
RUN pnpm --filter frontend build

# ---- dev: prostředí pro vývoj s watch režimem ----
# (Používá stejné závislosti jako deps; zdrojáky mountneme v compose.)
FROM deps AS dev
ENV NODE_ENV=development
# Volitelně lze doplnit nodemon/tsx; ponecháváme na package.json skriptech
# Defaultní příkaz může být přepsán v docker-compose (pnpm --filter server dev)
EXPOSE 3001
CMD ["pnpm", "--filter", "frontend", "dev"]

# ---- runtime: minimální image pro běh v produkci ----
FROM nginx:stable-alpine-perl AS runtime
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]