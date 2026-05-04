/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('bible_passage')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('author_id', 'bigint', (col) =>
      col.notNull().references('user_details.id').onDelete('cascade'),
    )
    .addColumn('title', 'varchar(255)')
    .addColumn('slug', 'varchar(5)')
    .addColumn('calendar_date', 'timestamp')
    .addColumn('priority', 'integer')
    .addColumn('passage_location', 'jsonb', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('bible_passage').execute();
}
