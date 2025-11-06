import {
  ConflictError,
  NotFoundError,
} from '../../shared/error_handler/errors.js';
import BibleRepository from './bible.repository.js';
import {
  BibleBook,
  BibleChapter,
  BibleTranslation,
  BibleTranslationMetadata,
  BibleVerse,
} from './bible.types.js';
import { translationParserProvider } from './translation_parser/translation_parser.js';

export class BibleService {
  protected repository: BibleRepository;

  constructor(repository: BibleRepository) {
    this.repository = repository;
  }

  getMetadataService = async (
    translation: string,
  ): Promise<BibleTranslationMetadata> => {
    const data = await this.repository.getTranslationMetadata(translation);
    if (data === undefined) throw new NotFoundError();
    return data;
  };

  getTranslationsService = async (): Promise<BibleTranslation[]> => {
    const data = await this.repository.getTranslations();
    return data;
  };

  getBooksService = async (translation: string): Promise<BibleBook[]> => {
    const data = await this.repository.getBooks(translation);
    return data;
  };

  getChaptersService = async (
    translation: string,
    book: number,
  ): Promise<BibleChapter[]> => {
    const data = await this.repository.getChapters(translation, book);
    return data;
  };

  getVersesService = async (
    translation: string,
    book: number,
    chapter: number,
  ): Promise<BibleVerse[]> => {
    const data = await this.repository.getVerses(translation, book, chapter);
    return data;
  };

  getVerseService = async (id: string): Promise<BibleVerse> => {
    const data = await this.repository.getVerseById(id);
    return data;
  };

  postTranslationService = async (fileString: string): Promise<void> => {
    const parser = translationParserProvider(fileString);
    const translation = await parser.getTranslation();
    const insertion = await this.repository.insertTranslation(translation);
    if (!insertion) {
      throw new ConflictError('Translation already exists in datatbase');
    }
  };
}
