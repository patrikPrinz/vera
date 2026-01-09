import type {
  BibleTranslationContainer,
  BibleTranslationMetadata,
  BibleTranslation,
  BibleBook,
  BibleChapter,
  BibleVerse,
} from './bible.types.js';

export interface IBibleRepository {
  getTranslationMetadata(
    translationCode: string,
  ): Promise<BibleTranslationMetadata | undefined>;

  getVerseById(id: string): Promise<BibleVerse | undefined>;

  getTranslations(): Promise<Array<BibleTranslation>>;

  getBooks(translation: string): Promise<BibleBook[]>;

  getChapters(translation: string, book: number): Promise<BibleChapter[]>;

  getVerses(
    translation: string,
    book: number,
    chapter: number,
  ): Promise<BibleVerse[] | undefined>;

  insertTranslation(translation: BibleTranslationContainer): Promise<boolean>;
}

export interface IBibleService {
  getMetadataService: (
    translation: string,
  ) => Promise<BibleTranslationMetadata>;

  getTranslationsService: () => Promise<BibleTranslation[]>;

  getBooksService: (translation: string) => Promise<BibleBook[]>;

  getChaptersService: (
    translation: string,
    book: number,
  ) => Promise<BibleChapter[]>;

  getVersesService: (
    translation: string,
    book: number,
    chapter: number,
  ) => Promise<BibleVerse[]>;

  getVerseService: (id: string) => Promise<BibleVerse>;

  postTranslationService: (fileString: string) => Promise<void>;
}
