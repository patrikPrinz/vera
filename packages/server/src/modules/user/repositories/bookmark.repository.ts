import type { Kysely } from 'kysely';
import { inject, injectable } from 'tsyringe';
import type { Database } from '../../../shared/postgres/schema.js';
import type { BibleLocation } from '../../../shared/types/bible/bible.types.js';
import type { Bookmark } from '../user.types.js';

@injectable()
export class BookmarkRepository {
  protected adapter: Kysely<Database>;

  constructor(@inject('PostgresAdapter') adapter: Kysely<Database>) {
    this.adapter = adapter;
  }

  public async InsertBookmark(
    authorId: string,
    name: string,
    location: BibleLocation,
  ): Promise<string> {
    const query = await this.adapter
      .insertInto('user_bookmarks')
      .values({
        author_id: authorId,
        bookmark_name: name,
        bible_translation: location.translation,
        bible_book: location.book,
        bible_chapter: location.chapter,
        bible_verse: location.verse,
      })
      .returning('id')
      .executeTakeFirst();

    if (!query) {
      return undefined;
    }
    return query.id;
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
      name: query.bookmark_name,
      location: {
        translation: query.bible_translation,
        book: query.bible_book,
        chapter: query.bible_chapter,
        verse: query.bible_verse,
      },
    } as Bookmark;
  }

  public async findBookmarkByTranslation(
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
