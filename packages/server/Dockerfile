# --- build stage ---
FROM node:22-alpine AS build
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@10 --activate

# Copy workspace (root) files
COPY pnpm-workspace.yml package.json tsconfig.base.json ./
# Copy server package files
COPY packages/server/package.json packages/server/tsconfig.json ./packages/server/
# Install deps (filtered for server)
RUN pnpm install --filter server... --frozen-lockfile

# Copy sources
COPY packages/server/src ./packages/server/src

# Build
RUN pnpm --filter server build

# --- runtime stage ---
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# Enable pnpm for prod install
RUN corepack enable && corepack prepare pnpm@10 --activate

# Copy server package json for prod deps and built dist
COPY --from=build /app/packages/server/package.json ./package.json
COPY --from=build /app/packages/server/dist ./dist

# Install production deps only
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000
CMD ["node","dist/index.js"]
