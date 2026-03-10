import type { PostgresPort } from './postgres_port.js';
import { Pool } from 'pg';
import { PostgresDialect } from 'kysely';
import { Kysely } from 'kysely';
import type { Database } from './schema.js';

export class PostgresAdapter implements PostgresPort {
  protected builder: Kysely<Database>;

  constructor(
    host: string,
    userName: string,
    password: string,
    dbName: string,
    port: number = 5432,
  ) {
    const connectionPool = new Pool({
      host: host,
      port: port,
      user: userName,
      password: password,
      database: dbName,
    });

    const dialect = new PostgresDialect({
      pool: connectionPool,
    });
    this.builder = new Kysely<Database>({
      dialect,
    });
  }
}
