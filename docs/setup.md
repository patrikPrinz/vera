# Environment variables

This document describes environment variables that can be used in `.env` file. 

`APP_ADMIN_USERNAME` and `APP_ADMIN_PASSWORD` are user for creation of default user account, when datababase is empty to provide and option to initially connect without writing directly into database.

If you want to use application services on non-default ports, you should set `SERVER_PORT`, `SERVER_ADDRESS`, `FRONTEND_PORT` and `FRONTEND_ADDRESS` to desired values. These PORT variables are used for docker port forwarding and ADDRESS for use with traefik and setting the correct CORS policy.

## Complete list

| Variable                | Default                      | Usage                                   |
| ----------------------- | ---------------------------- | --------------------------------------- |
| `APP_ADMIN_USERNAME`    | `admin`                      | App administrator account login         |
| `APP_ADMIN_PASSWORD`    | `password`                   | App administrator account password      |
| `SERVER_ADDRESS`        | localhost:3000               | Backend hostname and port for Traefik   |
| `SERVER_PORT`           | `3000`                       | Port, to which backend is forwarded     |
| `FRONTEND_ADDRESS`      | `localhost:3001`             | Frontend hostname and port for CORS and Traefik |
| `FRONTEND_PORT`         | `3001`                       | Port, to which frontend is forwarded    |
| `ELASTIC_NODE`          | `http://elastic-search:9200` | Elasticsearch node URL                  |
| `ELASTIC_USERNAME`      | `elastic`                    | Username for Elasticsearch              |
| `ELASTIC_PASSWORD`      | `pass`                       | Password for Elasticsearch              |
| `POSTGRES_USER`         | `postgres`                   | DB username                             |
| `POSTGRES_PASSWORD`     | `pass`                       | DB password                             |
| `POSTGRES_HOST`         | `postgres`                   | Postgres hostname                       |
| `POSTGRES_PORT`         | `5432`                       | Postgres database port                  |
| `POSTGRES_DB`           | `vera`                       | Database name                           |
