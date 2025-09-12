# base: set up workdir and pnpm
FROM node:22-alpine3.22 AS base
# the whole monorepo structure will be placed in /app directory
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10 --activate

# set CI env variable for pnpm optimisation
ENV CI=true


# dependencies: install project dependencies for build and testing
FROM base AS dependencies
# copy monorepo config files
COPY package.json \
  pnpm-workspace.yaml \
  pnpm-lock.yaml \
  tsconfig.base.json \
  ./

# copy package-specific configs
COPY packages/server/package.json \
  packages/server/tsconfig.json \
  ./packages/server/

RUN pnpm install --filter server


# build: run typescript build to create production artifacts
FROM dependencies AS build
# copy source code files onto the container
COPY packages/server/src ./packages/server/src

RUN pnpm --filter server build


# dev: run development server
FROM dependencies AS dev
ENV NODE_ENV=development

CMD ["pnpm", "--filter", "server", "dev"]

# runtime: production server container
FROM node:22-alpine3.22 AS runtime
WORKDIR /app
ENV NODE_ENV=production

# copy monorepo config files
COPY --chown=node:node \
  pnpm-workspace.yaml \
  package.json \
  pnpm-lock.yaml \
  ./

# copy package-specific config
COPY --chown=node:node \
  packages/server/package.json \
  ./packages/server/

# set up pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate

# install pnpm production packages
RUN pnpm install --filter server --prod --no-optional

# copy source files
COPY --from=build --chown=node:node /app/packages/server/dist ./packages/server/dist

EXPOSE 3000

USER node
CMD ["node", "packages/server/dist/index.js"]