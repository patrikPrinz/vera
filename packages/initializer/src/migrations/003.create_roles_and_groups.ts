/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('groups')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(50)', (col) => col.unique().notNull())
    .execute();

  await db.schema
    .createTable('user_groups')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('user_id', 'bigint', (col) =>
      col.notNull().references('user_details.id').onDelete('cascade'),
    )
    .addColumn('group_id', 'bigint', (col) =>
      col.notNull().references('groups.id').onDelete('cascade'),
    )
    .addUniqueConstraint('user_groups_unique', ['user_id', 'group_id'])
    .execute();

  await db.schema
    .createTable('roles')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('code', 'varchar(20)', (col) => col.unique().notNull())
    .addColumn('name', 'varchar(50)', (col) => col.notNull())
    .addColumn('is_group_role', 'boolean', (col) =>
      col.notNull().defaultTo(false),
    )
    .execute();

  await db.schema
    .createTable('user_roles')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('user_id', 'bigint', (col) =>
      col.notNull().references('user_details.id').onDelete('cascade'),
    )
    .addColumn('role_id', 'bigint', (col) =>
      col.notNull().references('roles.id').onDelete('cascade'),
    )
    .addColumn('group_id', 'bigint', (col) =>
      col.references('groups.id').onDelete('cascade'),
    )
    .execute();

  await db
    .insertInto('roles')
    .values([
      { code: 'admin', name: 'global admin' },
      { code: 'translation_admin', name: 'translation admin' },
      { code: 'calendar_admin', name: 'calendar admin' },
      {
        code: 'prayer_admin',
        name: 'prayer admin',
      },
      { code: 'group_admin', name: 'group admin', is_group_role: true },
      {
        code: 'group_content_admin',
        name: 'group content admin',
        is_group_role: true,
      },
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('groups').execute();
  await db.schema.dropTable('user_groups').execute();
  await db.schema.dropTable('roles').execute();
  await db.schema.dropTable('user_roles').execute();
}
