import type {
  BibleBook,
  BibleChapter,
  BibleTranslationMetadata,
  BibleVerse,
} from '@/shared/types/bible/bible.types';

export interface BibleHttpPort {
  getBibleBooks(translation: string): Promise<BibleBook[]>;

  getBibleChapters(translation: string, book: number): Promise<BibleChapter[]>;

  getBibleVerses(
    translation: string,
    book: number,
    chapter: number,
  ): Promise<BibleVerse[]>;

  getTranslationMetadata(
    translation: string,
  ): Promise<BibleTranslationMetadata | undefined>;
}
