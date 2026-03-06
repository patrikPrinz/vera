import type { Kysely } from 'kysely';
import { inject, injectable } from 'tsyringe';
import type { Database } from '../../../shared/postgres/schema.js';
import type { BibleLocation } from '../../../shared/types/bible/bible.types.js';
import type { Bookmark } from '../user.types.js';
import { ConflictError } from '../../../shared/error_handler/errors.js';
import type { DatabaseError } from 'pg';

@injectable()
export class BookmarkRepository {
  protected adapter: Kysely<Database>;

  constructor(@inject('PostgresAdapter') adapter: Kysely<Database>) {
    this.adapter = adapter;
  }

  /**
   * Method inserts bookmark into a database
   * @param bookmark bookmark to be inserted
   * @returns id of new bookmark
   */
  public async insertBookmark(bookmark: Bookmark): Promise<string> {
    try {
      const query = await this.adapter
        .insertInto('user_bookmarks')
        .values({
          author_id: bookmark.authorId,
          bookmark_name: bookmark.name,
          bible_translation: bookmark.location.translation,
          bible_book: bookmark.location.book,
          bible_chapter: bookmark.location.chapter,
          bible_verse: bookmark.location.verse,
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

  public async deleteBookmark(id: string): Promise<bigint> {
    const query = await this.adapter
      .deleteFrom('user_bookmarks')
      .where('id', '=', id)
      .executeTakeFirst();
    return query.numDeletedRows;
  }

  public async moveBookmark(
    id: string,
    newLocation: BibleLocation,
  ): Promise<BibleLocation | undefined> {
    const query = await this.adapter
      .updateTable('user_bookmarks')
      .set({
        bible_translation: newLocation.translation,
        bible_book: newLocation.book,
        bible_chapter: newLocation.chapter,
        bible_verse: newLocation.verse,
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

  public async findBookmarkById(id: string): Promise<Bookmark | undefined> {
    const query = await this.adapter
      .selectFrom('user_bookmarks')
      .select([
        'id',
        'author_id',
        'bookmark_name',
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
      authorId: query.author_id,
      name: query.bookmark_name,
      location: {
        translation: query.bible_translation,
        book: query.bible_book,
        chapter: query.bible_chapter,
        verse: query.bible_verse,
      },
    } as Bookmark;
  }

  public async findBookmarksByTranslation(
    authorId: string,
    translation: string,
  ): Promise<Bookmark[]> {
    const query = await this.adapter
      .selectFrom('user_bookmarks')
      .select([
        'id',
        'bookmark_name',
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
          name: e.bookmark_name,
          location: {
            translation: e.bible_translation,
            book: e.bible_book,
            chapter: e.bible_chapter,
            verse: e.bible_verse,
          },
        }) as Bookmark,
    );
  }
}
