# VERA Bible viewer
Vera is an application designed primarily for usage of Eastern Catholic parish in Olomouc. It is a progressive web application for displaying various Bible translations and psalms, their management, and study.

It provides these basic features (or will provide in the future):
- Managing multiple Bible translations
- Viewing text with option of creating notes, highlights, bookmarks and searching for phrases
- Creating and sharing passages from texts (also will provide daily passages)
- Viewing psalms by kaftisms
- Managing user accounts and psalm prayer groups

# Installation and setup

## Prerequisites
- Docker with docker compose
- Internet connection
- Node.js and pnpm (optional, for build and developpurposes)

## How to run it
Each release of the application builds new docker images for each app package.

Default way to run is using docker compose. You can find a basic docker compose file in the repo in `deployment/docker-compose.yaml`.

Default docker compose file will pull images for latest app packages and run them. You can find more about docker compose configuration in Development section.

Docker compose contains its default values for environment variables. Since it is all packaged with docker, it should work out of the box even without `.env`. Still it is a good idea to add the file. Especially if you want to build images and run the containers locally.

To run the containers you can download and run the docker compose like this:

### Linux/MacOS
```bash
mkdir vera && cd vera
wget https://github.com/patrikPrinz/vera/deployment/docker-compose.yaml

docker compose up
```

### Windows
1. Download or copy-paste the docker-compose file.
2. In the directory run `docker-compose up` command.

## Development
For development purposes you can build containers locally and run with pnpm scripts.

## Environment
If you want to use the basic setup, you don't need the `.env` file. But it can come in handy for example if you have your own elasticsearch cluster, or when you want to run the frontend and backend separately.

It is also useful for specifying if running in test, development or production environment.

# Packages
Project is structured in monorepo consisting of different packages, which cooperate.

## Server
Backend part of the application provides API for frontend  and performs communication with databases and other underlying services.

## Frontend
User web interface with PWA support.

## Elastic-initializer
Package performs checks and initialization of Elasticsearch database. Initializes indices on startup.
