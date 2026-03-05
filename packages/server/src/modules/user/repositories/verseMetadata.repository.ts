import type { Kysely } from 'kysely';
import { inject, injectable } from 'tsyringe';
import type { Database } from '../../../shared/postgres/schema.js';
import type { BibleLocation } from '../../../shared/types/bible/bible.types.js';
import type { UserVerseMetadata } from '../user.types.js';

@injectable()
export class VerseMetadataRepository {
  protected adapter: Kysely<Database>;

  constructor(@inject('PostgresAdapter') adapter: Kysely<Database>) {
    this.adapter = adapter;
  }

  public async InsertVerseMetadata(
    authorId: string,
    color: string,
    text: string,
    location: BibleLocation,
  ): Promise<string> {
    const query = await this.adapter
      .insertInto('bible_user_metadata')
      .values({
        author_id: authorId,
        bible_translation: location.translation,
        bible_book: location.book,
        bible_chapter: location.chapter,
        bible_verse: location.verse,
        highlight_color: color,
        note_text: text,
      })
      .returning('id')
      .executeTakeFirst();

    if (!query) {
      return undefined;
    }
    return query.id;
  }

  public async deleteVerseMetadata(id: string): Promise<bigint> {
    const query = await this.adapter
      .deleteFrom('bible_user_metadata')
      .where('id', '=', id)
      .executeTakeFirst();
    return query.numDeletedRows;
  }

  public async editVerseMetadata(
    id: string,
    newText: string,
    newColor: string,
  ): Promise<BibleLocation | undefined> {
    const query = await this.adapter
      .updateTable('bible_user_metadata')
      .set({
        highlight_color: newColor,
        note_text: newText,
      })
      .where('id', '=', id)
      .returning([
        'bible_translation',
        'bible_book',
        'bible_chapter',
        'bible_verse',
      ])
      .executeTakeFirst();

    if (!query) {
      return undefined;
    }

    return {
      translation: query.bible_translation,
      book: query.bible_book,
      chapter: query.bible_chapter,
      verse: query.bible_verse,
    } as BibleLocation;
  }

  public async findVerseMetadatakById(
    id: string,
  ): Promise<UserVerseMetadata | undefined> {
    const query = await this.adapter
      .selectFrom('bible_user_metadata')
      .select([
        'id',
        'note_text',
        'highlight_color',
        'bible_translation',
        'bible_book',
        'bible_chapter',
        'bible_verse',
      ])
      .where('id', '=', id)
      .executeTakeFirst();

    if (!query) {
      return undefined;
    }
    return {
      id: query.id,
      noteText: query.note_text,
      highlightColor: query.highlight_color,
      location: {
        translation: query.bible_translation,
        book: query.bible_book,
        chapter: query.bible_chapter,
        verse: query.bible_verse,
      },
    } as UserVerseMetadata;
  }

  public async findVerseMetadataByLocation(
    location: BibleLocation,
  ): Promise<UserVerseMetadata[]> {
    const query = await this.adapter
      .selectFrom('bible_user_metadata')
      .select([
        'id',
        'note_text',
        'highlight_color',
        'bible_translation',
        'bible_book',
        'bible_chapter',
        'bible_verse',
      ])
      .where('bible_translation', '=', location.translation)
      .execute();
    if (query.length == 0) {
      return [];
    }
    return query.map(
      (e) =>
        ({
          id: e.id,
          noteText: e.note_text,
          highlightColor: e.highlight_color,
          location: {
            translation: e.bible_translation,
            book: e.bible_book,
            chapter: e.bible_chapter,
            verse: e.bible_verse,
          },
        }) as UserVerseMetadata,
    );
  }
}
