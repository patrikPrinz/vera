/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('group_content')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('group_id', 'bigint', (col) =>
      col.notNull().references('groups.id').onDelete('cascade'),
    )
    .addColumn('title', 'varchar(50)', (col) => col.unique().notNull())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('group_content').execute();
}
