FROM node:lts-alpine3.21

#RUN npm install -g pnpm@latest-10
RUN npm install --global corepack@latest
RUN corepack enable --global pnpm
RUN corepack use pnpm@latest-10

WORKDIR /app/packages/server

COPY pnpm-lock.yaml package.json tsconfig.json ./
RUN pnpm install

COPY dist .

RUN pnpm build

EXPOSE 3000

CMD ["node", "dist/index.js"]
