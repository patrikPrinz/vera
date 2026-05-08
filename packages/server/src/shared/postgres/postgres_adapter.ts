import { Pool } from 'pg';
import { PostgresDialect } from 'kysely';
import { Kysely } from 'kysely';
import type { Database } from './schema.js';
import { singleton } from 'tsyringe';

@singleton()
export class PostgresAdapter extends Kysely<Database> {
  constructor() {
    const port = Number(process.env.POSTGRES_PORT);
    const connectionPool = new Pool({
      host: process.env.POSTGRES_HOST ?? 'localhost',
      user: process.env.POSTGRES_USER ?? 'postgres',
      password: process.env.POSTGRES_PASSWORD ?? 'pass',
      database: process.env.POSTGRES_DB ?? 'vera',
      port: port ?? 5432,
    });

    const dialect = new PostgresDialect({
      pool: connectionPool,
    });
    super({ dialect });
  }
}
