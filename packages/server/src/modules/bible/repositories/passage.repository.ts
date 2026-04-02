import { sql, type Kysely } from 'kysely';
import { injectable, inject } from 'tsyringe';
import type { Database } from '../../../shared/postgres/schema.js';
import type { BiblePassage } from '../../../shared/types/bible/passage.types.js';

@injectable()
export class PassageRepository {
  protected adapter: Kysely<Database>;

  constructor(@inject('PostgresAdapter') adapter: Kysely<Database>) {
    this.adapter = adapter;
  }

  public async insertPassage(passage: BiblePassage): Promise<string> {
    const query = await this.adapter
      .insertInto('bible_passage')
      .values({
        author_id: passage.authorId,
        title: passage.title,
        slug: passage.slug,
        calendar_date: passage.calendarDate,
        passage_location: passage.passageLocation,
      })
      .returning('id')
      .executeTakeFirst();
    if (query) {
      return query.id;
    }
    return undefined;
  }

  async findPassage(
    mode: 'id',
    value: string,
  ): Promise<BiblePassage | undefined> {
    const query = await this.adapter
      .selectFrom('bible_passage')
      .select([
        'id',
        'author_id',
        'title',
        'slug',
        'calendar_date',
        'passage_location',
        'created_at',
      ])
      .where(mode, '=', value)
      .executeTakeFirst();

    if (query) {
      return {
        id: query.id,
        authorId: query.author_id,
        title: query.title,
        slug: query.slug,
        calendarDate: query.calendar_date,
        passageLocation: query.passage_location,
        createdAt: query.created_at,
      } as BiblePassage;
    }
    return undefined;
  }

  public async findPassageById(id: string): Promise<BiblePassage | undefined> {
    return await this.findPassage('id', id);
  }

  public async findPassagesByDate(date: string): Promise<BiblePassage[]> {
    const query = await this.adapter
      .selectFrom('bible_passage')
      .select([
        'id',
        'author_id',
        'title',
        'slug',
        'calendar_date',
        'passage_location',
        'created_at',
      ])
      .where('calendar_date', '=', date)
      .orderBy(sql`priority IS NULL`)
      .orderBy('priority', 'asc')
      .execute();

    if (query.length == 0) {
      return [];
    }
    return query.map(
      (e) =>
        ({
          id: e.id,
          authorId: e.author_id,
          title: e.title,
          slug: e.slug,
          calendarDate: e.calendar_date,
          passageLocation: e.passage_location,
          createdAt: e.created_at,
        }) as BiblePassage,
    );
  }

  public async updatePassage(passage: BiblePassage): Promise<boolean> {
    const query = await this.adapter
      .updateTable('bible_passage')
      .set({
        author_id: passage.authorId,
        title: passage.title,
        slug: passage.slug,
        calendar_date: passage.calendarDate,
        passage_location: passage.passageLocation,
      })
      .where('id', '=', passage.id)
      .executeTakeFirst();
    return query.numUpdatedRows > 0;
  }

  public async deletePassage(id: string): Promise<boolean> {
    const query = await this.adapter
      .deleteFrom('bible_passage')
      .where('id', '=', id)
      .executeTakeFirst();
    return query.numDeletedRows > 0;
  }
}
