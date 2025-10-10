import { estypes } from '@elastic/elasticsearch';
import ElasticAdapter from '../../shared/es/elastic_adapter.js';
import { BibleTranslation, BibleVerse } from './bible.types.js';

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

  public async getTranslationVerses(translation: string) {
    const query = {
      match: {
        translation: translation
      }
    };
    return await this.adapter.search(this.index, query);
  }

  public async getTranslations(): Promise<Array<BibleTranslation>> {
    const query = {
      terms: {
        field: "translation"
      }
    };
    const data = await this.adapter.aggregate(this.index, query) as estypes.AggregationsStringTermsAggregate;
    const buckets = data.buckets || [];
    const translations: Array<BibleTranslation> = (buckets as Array<any>).map((element) => ({
      translation: element.key
    }));
    return translations;
  }

  public async bulkInsert(data: Array<BibleVerse>): Promise<void> {
    await this.adapter.bulkIndex(this.index, data);
  }

  public async insertTranslation(data: Array<BibleVerse>): Promise<void> {
    
  }
}
