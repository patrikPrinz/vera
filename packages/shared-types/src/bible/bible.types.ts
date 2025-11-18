export interface BibleVerse {
  id?: string;
  translation: string;
  book: number;
  chapter: number;
  verse: number;
  text: string;
  isHeader: boolean;
}

export interface BibleChapter {
  translation: string;
  book: number;
  chapter: number;
  verses?: BibleVerse[];
}

export interface BibleBook {
  translation: string;
  book: number;
  chapters?: BibleChapter[];
}

export interface BibleTranslation {
  translation: string;
  books?: BibleBook[];
}

export interface BibleTranslationMetadata {
  id?: string;
  code: string;
  language?: string;
  date?: Date;
  creator?: string;
  source: string;
  books: {
    bookNumber: number;
    name: string;
    code: string;
  }[];
}

export interface BibleTranslationContainer {
  data: BibleVerse[];
  metadata: BibleTranslationMetadata;
}
