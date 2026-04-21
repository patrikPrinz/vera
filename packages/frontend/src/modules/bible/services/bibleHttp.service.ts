import type {
  BibleBook,
  BibleChapter,
  BibleTranslationMetadata,
  BibleVerse,
} from '@/shared/types/bible/bible.types';
import { Axios } from 'axios';

export interface IBibleHttpService {
  getBibleBooks(translation: string): Promise<BibleBook[]>;

  getBibleChapters(translation: string, book: number): Promise<BibleChapter[]>;

  getBibleVerses(
    translation: string,
    book: number,
    chapter: number,
  ): Promise<BibleVerse[]>;

  getTranslations(): Promise<{ translation: string }[]>;

  getTranslationMetadata(
    translation: string,
  ): Promise<BibleTranslationMetadata | undefined>;

  importTranslation(
    file: File,
    requestTimeoutMs?: number | null,
  ): Promise<boolean>;
}

export class BibleHttpService implements IBibleHttpService {
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

  public async getTranslations(): Promise<{ translation: string }[]> {
    const data = await this.client.get('bible/translations');
    if (data.data) {
      return data.data as Promise<{ translation: string }[]>;
    }
    return [];
  }

  public async getTranslationMetadata(
    translation: string = 'CZECEP',
  ): Promise<BibleTranslationMetadata | undefined> {
    const data = await this.client.get(`bible/translation/${translation}`);
    if (data.data) {
      return data.data as BibleTranslationMetadata;
    }
    return undefined;
  }

  public async importTranslation(
    file: File,
    requestTimeoutMs: number | null = null,
  ): Promise<boolean> {
    const form = new FormData();
    form.append('translation', file);

    try {
      const response = await this.client.post('bible/translation', form, {
        timeout: requestTimeoutMs !== null ? requestTimeoutMs : 180000,
        timeoutErrorMessage: 'Request timed out.',
      });
      if (
        response.status === 400 ||
        response.status === 409 ||
        response.status === 500
      ) {
        return false;
      }
      return response.status >= 200 && response.status < 300;
    } catch (_e) {
      return false;
    }
  }
}
