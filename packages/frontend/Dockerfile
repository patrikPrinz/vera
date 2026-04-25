# base: set up workdir and pnpm
FROM node:22-alpine3.22 AS base
# the whole monorepo structure will be placed in /app directory
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10 --activate

# set CI env variable for pnpm optimisation
ENV CI=true

# deps: install project dependencies for build and testing
FROM base AS deps
# copy global config files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./
# copy package-specific configs for installation
COPY packages/frontend/package.json packages/frontend/tsconfig.json ./packages/frontend/

RUN pnpm install --filter frontend... --no-frozen-lockfile
# install package-specific configs for development and build
COPY packages/frontend/vite.config.js\
    packages/frontend/index.html\
    ./packages/frontend/

COPY packages/frontend/public ./packages/frontend/public

# builder: build for production
FROM deps AS builder
# copy source code for build
COPY packages/frontend/src ./packages/frontend/src
COPY packages/shared-types ./packages/shared-types

RUN pnpm --filter frontend build

# dev: run for development purposes with bind-mounted source code
FROM deps AS dev
ENV NODE_ENV=development

EXPOSE 3001
CMD ["pnpm", "--filter", "frontend", "dev"]

# runtime: serve cpoduction-compiled artifacts with nginx
FROM nginx:stable-alpine-perl AS runtime
ENV ASSET_DIR="/usr/share/nginx/html"
ENV APP_PREFIX="VITE_"

COPY packages/frontend/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html

# use script for renaming vite global variables
COPY packages/frontend/scripts/env.sh /docker-entrypoint.d/env.sh
RUN dos2unix /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
