import { GenericContainer, StartedTestContainer } from 'testcontainers';
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from 'kysely';
import path, { dirname } from 'path';
import { promises as fs } from 'fs';
import { Pool } from 'pg';
import { fileURLToPath } from 'url';
import { Database } from '../../../src/shared/postgres/schema';
import bcrypt from 'bcrypt';

export async function startPostgresContainer() {
  const container = await new GenericContainer('postgres:18')
    .withEnvironment({
      POSTGRES_DB: 'vera',
      POSTGRES_PASSWORD: 'pass',
    })
    .withExposedPorts(5432)
    .start();

  const db = await migratePostgres(container);

  return { container: container, db: db };
}

async function migratePostgres(container: StartedTestContainer) {
  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: container.getHost(),
        user: process.env.POSTGRES_USER ?? 'postgres',
        password: process.env.POSTGRES_PASSWORD ?? 'pass',
        database: process.env.POSTGRES_DB ?? 'vera',
        port: container.getMappedPort(5432),
        // Test pool config - aggressive timeouts to avoid reconnect attempts
        idleTimeoutMillis: 2000,
        connectionTimeoutMillis: 5000,
        max: 2,
        min: 0,
      }),
    }),
  });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '../../../../shared/migrations'),
    }),
  });
  await migrator.migrateToLatest();
  return db;
}

export async function seedAdminUser(
  conn: Kysely<Database>,
  username: string = 'admin',
  password: string = 'password',
) {
  const userId: string = (
    await conn
      .insertInto('user_details')
      .values({ email: username })
      .returning('id')
      .executeTakeFirstOrThrow()
  ).id;

  const authId = await conn
    .insertInto('authentication')
    .values({
      user_id: userId,
      provider_id: 1,
      provider_account_identifier: `local<${userId}>`,
    })
    .returning('id')
    .executeTakeFirstOrThrow();

  await conn
    .insertInto('credentials')
    .values({
      authentication_id: authId.id,
      password_hash: bcrypt.hashSync(password, 10),
    })
    .executeTakeFirstOrThrow();

  await conn
    .insertInto('user_roles')
    .values({ role_id: '1', user_id: '1' })
    .executeTakeFirstOrThrow();
}
