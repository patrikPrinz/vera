import { estypes } from '@elastic/elasticsearch';
import ElasticAdapter from '../../shared/es/elastic_adapter.js';
import {
  BibleBook,
  BibleChapter,
  BibleTranslation,
  BibleVerse,
} from './bible.types.js';

export default class BibleRepository {
  protected index: string;
  protected adapter: ElasticAdapter;

  constructor(adapter: ElasticAdapter) {
    this.index = 'bible';
    this.adapter = adapter;
  }

  public async getVerseById(id: string): Promise<BibleVerse> {
    const data = await this.adapter.get<BibleVerse>(this.index, id);
    return {
      ...data,
      id,
    };
  }

  public async getTranslationVerses(
    translation: string,
  ): Promise<BibleVerse[]> {
    const query = {
      match: {
        translation: translation,
      },
    };
    return await this.adapter.search(this.index, query);
  }

  public async getTranslations(): Promise<Array<BibleTranslation>> {
    const query = {
      terms: {
        field: 'translation',
      },
    };
    const data = (await this.adapter.aggregate(
      this.index,
      query,
    )) as estypes.AggregationsStringTermsAggregate;

    const buckets: estypes.AggregationsBuckets<estypes.AggregationsStringTermsBucket> =
      data.buckets || [];

    const translations: Array<BibleTranslation> = (
      buckets as Array<estypes.AggregationsStringTermsBucket>
    ).map((element) => ({
      translation: element.key as string,
    }));

    return translations;
  }

  public async getBooks(translation: string): Promise<BibleBook[]> {
    const query = {
      match: { translation: translation },
    };
    const aggregation = {
      terms: {
        field: 'book',
      },
      aggs: {
        sort_buckets: {
          bucket_sort: {
            sort: [{ _key: 'asc' }],
          },
        },
      },
    };
    const data = (await this.adapter.aggregate(
      this.index,
      aggregation,
      query,
    )) as estypes.AggregationsStringTermsAggregate;

    const buckets: estypes.AggregationsBuckets<estypes.AggregationsStringTermsBucket> =
      data.buckets || [];

    const books: BibleBook[] = (
      buckets as Array<estypes.AggregationsStringTermsBucket>
    ).map((element) => ({
      translation: translation,
      book: element.key as number,
    }));

    return books;
  }

  public async getChapters(
    translation: string,
    book: number,
  ): Promise<BibleChapter[]> {
    const query = {
      bool: {
        must: [
          { match: { translation: translation } },
          { match: { book: book } },
        ],
      },
    };
    const aggregation = {
      terms: {
        field: 'chapter',
      },
      aggs: {
        sort_buckets: {
          bucket_sort: {
            sort: [{ _key: 'asc' }],
          },
        },
      },
    };
    const data = (await this.adapter.aggregate(
      this.index,
      aggregation,
      query,
    )) as estypes.AggregationsStringTermsAggregate;

    const buckets: estypes.AggregationsBuckets<estypes.AggregationsStringTermsBucket> =
      data.buckets || [];

    const chapters: BibleChapter[] = (
      buckets as Array<estypes.AggregationsStringTermsBucket>
    ).map((element) => ({
      translation: translation,
      book: book,
      chapter: element.key as number,
    }));

    return chapters;
  }

  public async getVerses(
    translation: string,
    book: number,
    chapter: number,
  ): Promise<BibleVerse[]> {
    const query = {
      bool: {
        must: [
          {
            match: {
              translation: translation,
            },
          },
          {
            match: {
              book: book,
            },
          },
          {
            match: {
              chapter: chapter,
            },
          },
        ],
      },
    };
    return await this.adapter.search(this.index, query);
  }

  public async bulkInsert(data: Array<BibleVerse>): Promise<void> {
    await this.adapter.bulkIndex(this.index, data);
  }

  public async insertTranslation(data: Array<BibleVerse>): Promise<void> {
    await this.bulkInsert(data);
  }
}
