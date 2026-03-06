import type { Kysely } from 'kysely';
import { inject, injectable } from 'tsyringe';
import type { Database } from '../../../shared/postgres/schema.js';
import type {
  BibleChapter,
  BibleLocation,
} from '../../../shared/types/bible/bible.types.js';
import type { UserVerseMetadata } from '../user.types.js';
import type { DatabaseError } from 'pg';
import { ConflictError } from '../../../shared/error_handler/errors.js';

@injectable()
export class VerseMetadataRepository {
  protected adapter: Kysely<Database>;

  constructor(@inject('PostgresAdapter') adapter: Kysely<Database>) {
    this.adapter = adapter;
  }

  public async InsertVerseMetadata(
    metadata: UserVerseMetadata,
  ): Promise<string> {
    try {
      const query = await this.adapter
        .insertInto('bible_user_metadata')
        .values({
          author_id: metadata.authorId,
          bible_translation: metadata.location.translation,
          bible_book: metadata.location.book,
          bible_chapter: metadata.location.chapter,
          bible_verse: metadata.location.verse,
          highlight_color: metadata.highlightColor,
          note_text: metadata.noteText,
        })
        .returning('id')
        .executeTakeFirst();

      if (!query) {
        return undefined;
      }
      return query.id;
    } catch (err: unknown) {
      if ((err as DatabaseError).code === '23505') {
        throw new ConflictError('Bookmark already exists');
      }
    }
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
    userId: string,
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
      .where('bible_book', '=', location.book)
      .where('bible_chapter', '=', location.chapter)
      .where('bible_verse', '=', location.verse)
      .where('author_id', '=', userId)
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

  public async findVerseMetadataByChapter(
    userId: string,
    location: BibleChapter,
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
      .where('bible_book', '=', location.book)
      .where('bible_chapter', '=', location.chapter)
      .where('author_id', '=', userId)
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

  public async findVerseMetadataByTranslation(
    authorId: string,
    translation: string,
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
      .where('bible_translation', '=', translation)
      .where('author_id', '=', authorId)
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
