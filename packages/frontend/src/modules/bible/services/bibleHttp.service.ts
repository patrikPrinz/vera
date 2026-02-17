import type {
  BibleBook,
  BibleChapter,
  BibleTranslationMetadata,
  BibleVerse,
} from '@/shared/types/bible/bible.types';
import { Axios } from 'axios';
import type { BibleHttpPort } from './bibleHttp.port';

export class BibleHttpService implements BibleHttpPort {
  protected client: Axios;

  constructor(client: Axios) {
    this.client = client;
  }

  public async getBibleBooks(translation: string): Promise<BibleBook[]> {
    const data = await this.client.get(
      `bible/translation/${translation}/books`,
    );
    if (data.data) {
      return data.data as BibleBook[];
    }
    return [];
  }

  public async getBibleChapters(
    translation: string,
    book: number,
  ): Promise<BibleChapter[]> {
    const data = await this.client.get(
      `bible/translation/${translation}/book/${book}/chapters`,
    );
    if (data.data) {
      return data.data as BibleChapter[];
    }
    return [];
  }

  public async getBibleVerses(
    translation: string,
    book: number,
    chapter: number,
  ) {
    const data = await this.client.get(
      `bible/translation/${translation}/book/${book}/chapter/${chapter}/verses`,
    );
    if (data.data) {
      return data.data as BibleVerse[];
    }
    return [];
  }

  public async getTranslationMetadata(
    translation: string,
  ): Promise<BibleTranslationMetadata | undefined> {
    const data = await this.client.get(`bible/translation/${translation}`);
    if (data.data) {
      return data.data as BibleTranslationMetadata;
    }
    return undefined;
  }
}
