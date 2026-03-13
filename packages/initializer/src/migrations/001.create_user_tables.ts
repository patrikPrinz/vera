import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user_details')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('username', 'varchar(50)')
    .addColumn('email', 'varchar(255)', (col) => col.unique().notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await db.schema
    .createTable('auth_provider')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('code', 'varchar(50)', (col) => col.unique().notNull())
    .addColumn('name', 'varchar(50)', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('authentication')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('user_id', 'bigint', (col) =>
      col.notNull().references('user_details.id').onDelete('cascade'),
    )
    .addColumn('provider_id', 'integer', (col) =>
      col.notNull().references('auth_provider.id').onDelete('cascade'),
    )
    .addColumn('provider_account_identifier', 'varchar(255)', (col) =>
      col.notNull(),
    )
    .addUniqueConstraint('authentication_unique', [
      'provider_id',
      'provider_account_identifier',
    ])
    .execute();

  await db.schema
    .createTable('credentials')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('authentication_id', 'bigint', (col) =>
      col
        .unique()
        .notNull()
        .references('authentication.id')
        .onDelete('cascade'),
    )
    .addColumn('password_hash', 'varchar(255)', (col) => col.notNull())
    .execute();

  await db
    .insertInto('auth_provider')
    .values({
      code: 'local',
      name: 'Log in with email',
    })
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user_details').execute();
  await db.schema.dropTable('auth_provider').execute();
  await db.schema.dropTable('authentication').execute();
  await db.schema.dropTable('credentials').execute();
}
