import type { estypes } from '@elastic/elasticsearch';
import { injectable, inject } from 'tsyringe';

import ElasticAdapter from '../../shared/elastic/elastic_adapter.js';
import type {
  BibleBook,
  BibleChapter,
  BibleTranslation,
  BibleTranslationContainer,
  BibleTranslationMetadata,
  BibleVerse,
} from './bible.types.js';
import type { IBibleRepository } from './bible.interfaces.js';

@injectable()
export class BibleRepository implements IBibleRepository {
  protected bibleIndex: string;
  protected metadataIndex: string;
  protected adapter: ElasticAdapter;

  constructor(@inject('ElasticAdapter') adapter: ElasticAdapter) {
    this.bibleIndex = 'bible';
    this.metadataIndex = 'translation_metadata';
    this.adapter = adapter;
  }

  public async getTranslationMetadata(
    translationCode: string,
  ): Promise<BibleTranslationMetadata | undefined> {
    const query = {
      match: {
        code: translationCode,
      },
    };
    const data = await this.adapter.search(this.metadataIndex, query);
    if (data.length == 0) {
      return undefined;
    }
    const metadata = data.map((element) => {
      const fields = element._source as BibleTranslationMetadata;
      return {
        id: element._id,
        code: fields.code,
        language: fields.language,
        date: new Date(fields.date),
        creator: fields.creator,
        source: fields.source,
        books: fields.books.map((book) => {
          return {
            bookNumber: Number(book.bookNumber),
            name: book.name,
            code: book.code,
          };
        }),
      } as BibleTranslationMetadata;
    });
    return metadata[0];
  }

  public async getVerseById(id: string): Promise<BibleVerse | undefined> {
    const data = (await this.adapter.get(this.bibleIndex, id)) as BibleVerse;
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

  public async getTranslations(): Promise<Array<BibleTranslation>> {
    const query = {
      terms: {
        field: 'translation',
      },
    };
    const data = (await this.adapter.aggregate(
      this.bibleIndex,
      query,
    )) as estypes.AggregationsStringTermsAggregate;

    if (!data) {
      return [];
    }

    const buckets = data.buckets as estypes.AggregationsStringTermsBucket[];

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
        size: 100,
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
      this.bibleIndex,
      aggregation,
      query,
    )) as estypes.AggregationsStringTermsAggregate;

    const buckets = data.buckets as estypes.AggregationsStringTermsBucket[];

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
        size: 200,
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
      this.bibleIndex,
      aggregation,
      query,
    )) as estypes.AggregationsStringTermsAggregate;

    const buckets = data.buckets as estypes.AggregationsStringTermsBucket[];

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
  ): Promise<BibleVerse[] | undefined> {
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
    const data = await this.adapter.search(this.bibleIndex, query);

    if (!data || data.length == 0) {
      return undefined;
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

  public async insertTranslation(
    translation: BibleTranslationContainer,
  ): Promise<boolean> {
    if (await this.uniqueTranslation(translation.metadata.code)) {
      await this.insertTranslationVerses(translation.data);
      await this.insertTranslationMetadata(translation.metadata);
      return true;
    }
    return false;
  }

  protected async uniqueTranslation(translationCode: string): Promise<boolean> {
    const translations = await this.getTranslations();
    for (const translation of translations) {
      if (translation.translation == translationCode) {
        return false;
      }
    }
    return true;
  }

  protected async insertTranslationVerses(
    data: Array<BibleVerse>,
  ): Promise<void> {
    await this.adapter.bulkIndex(this.bibleIndex, data);
  }

  protected async insertTranslationMetadata(
    metadata: BibleTranslationMetadata,
  ): Promise<void> {
    await this.adapter.index(this.metadataIndex, metadata);
  }
}
