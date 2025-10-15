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

  public async getVerseById(id: string): Promise<BibleVerse | undefined> {
    const data = (await this.adapter.get(this.index, id)) as BibleVerse;
    if (data === undefined) {
      return undefined;
    }
    return {
      id: id,
      book: Number(data.book),
      chapter: Number(data.chapter),
      verse: Number(data.verse),
      text: data.text,
      isHeader: data.isHeader,
    } as BibleVerse;
  }

  public async getTranslationVerses(
    translation: string,
  ): Promise<BibleVerse[]> {
    const query = {
      match: {
        translation: translation,
      },
    };
    const data = await this.adapter.search(this.index, query);
    if (data === undefined) {
      return [];
    }
    const verses = data.map((element) => {
      const fields = element._source as BibleVerse;
      return {
        id: element._id,
        book: Number(fields.book),
        chapter: Number(fields.chapter),
        verse: Number(fields.verse),
        text: fields.text,
        isHeader: fields.isHeader,
      } as BibleVerse;
    });
    return verses;
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

    const buckets = (data.buckets ||
      []) as estypes.AggregationsStringTermsBucket[];

    const translations: BibleTranslation[] = buckets.map((element) => ({
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

    const buckets = (data.buckets ||
      []) as estypes.AggregationsStringTermsBucket[];

    const books: BibleBook[] = buckets.map((element) => ({
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

    const buckets = (data.buckets ||
      []) as estypes.AggregationsStringTermsBucket[];

    const chapters: BibleChapter[] = buckets.map((element) => ({
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
    const data = await this.adapter.search(this.index, query);
    console.log(data);
    if (data === undefined) {
      return [];
    }
    const verses = data.map((element) => {
      const fields = element._source as BibleVerse;
      console.log(fields);
      return {
        id: element._id,
        book: Number(fields.book),
        chapter: Number(fields.chapter),
        verse: Number(fields.verse),
        text: fields.text,
        isHeader: fields.isHeader,
      } as BibleVerse;
    });
    return verses;
  }

  public async bulkInsert(data: Array<BibleVerse>): Promise<void> {
    await this.adapter.bulkIndex(this.index, data);
  }

  public async insertTranslation(data: Array<BibleVerse>): Promise<void> {
    await this.bulkInsert(data);
  }
}
