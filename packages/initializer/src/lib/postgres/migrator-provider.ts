import {
  FileMigrationProvider,
  Migrator,
  PostgresDialect,
  Kysely,
} from 'kysely';
import path, { dirname } from 'path';
import { Pool } from 'pg';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = (
  process.env.POSTGRES_PORT ? new Number(process.env.POSTGRES_PORT) : 5432
) as number;
export const db = new Kysely<unknown>({
  dialect: new PostgresDialect({
    pool: new Pool({
      host: process.env.POSTGRES_HOST ?? 'localhost',
      user: process.env.POSTGRES_USER ?? 'postgres',
      password: process.env.POSTGRES_PASSWORD ?? 'pass',
      database: process.env.POSTGRES_DB ?? 'vera',
      port: port,
    }),
  }),
});

export function createMigrator(db?: Kysely<unknown>): Migrator {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '../../migrations'),
    }),
  });

  return migrator;
}
