import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user_bookmarks')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('bible_translation', 'varchar(10)', (col) => col.notNull())
    .addColumn('bible_book', 'smallint', (col) => col.notNull())
    .addColumn('bible_chapter', 'smallint', (col) => col.notNull())
    .addColumn('bible_verse', 'smallint', (col) => col.notNull())
    .addColumn('author_id', 'bigint', (col) =>
      col.notNull().references('user_details.id').onDelete('cascade'),
    )
    .addColumn('bookmark_name', 'varchar(50)', (col) => col.notNull())
    .addUniqueConstraint('user_bookmaks_unique', [
      'author_id',
      'bookmark_name',
      'bible_translation',
    ])
    .execute();

  await db.schema
    .createTable('bible_user_metadata')
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('bible_translation', 'varchar(10)', (col) => col.notNull())
    .addColumn('bible_book', 'smallint', (col) => col.notNull())
    .addColumn('bible_chapter', 'smallint', (col) => col.notNull())
    .addColumn('bible_verse', 'smallint', (col) => col.notNull())
    .addColumn('author_id', 'bigint', (col) =>
      col.notNull().references('user_details.id').onDelete('cascade'),
    )
    .addColumn('highlight_color', 'varchar(10)')
    .addColumn('note_text', 'text')
    .addUniqueConstraint('bible_user_metadata_unique', [
      'bible_translation',
      'bible_book',
      'bible_chapter',
      'bible_verse',
      'author_id',
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user_bookmarks').execute();
  await db.schema.dropTable('bible_user_metadata').execute();
}
