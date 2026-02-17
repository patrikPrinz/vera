import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import type { Database } from './schema.js';

export const kyselyFactory = (
  host: string,
  userName: string,
  password: string,
  dbName: string,
  port: number = 5432,
): Kysely<Database> => {
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
  return new Kysely<Database>({
    dialect,
  });
};
