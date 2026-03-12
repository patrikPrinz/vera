import { injectable, inject } from 'tsyringe';
import {
  ConflictError,
  NotFoundError,
} from '../../shared/error_handler/errors.js';
import type { IBibleService, IBibleRepository } from './bible.interfaces.js';
import type {
  BibleBook,
  BibleChapter,
  BibleTranslation,
  BibleTranslationMetadata,
  BibleVerse,
} from './bible.types.js';
import type { TranslationParserFactory } from './translation_parser/translation_parser.js';

@injectable()
export class BibleService implements IBibleService {
  protected readonly repository: IBibleRepository;
  protected readonly translationParserFactory: TranslationParserFactory;

  constructor(
    @inject('BibleRepository') repository: IBibleRepository,
    @inject('TranslationParserFactory')
    translationParserFactory: TranslationParserFactory,
  ) {
    this.repository = repository;
    this.translationParserFactory = translationParserFactory;
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
    if (data === undefined) throw new NotFoundError();
    return data;
  };

  getVerseService = async (id: string): Promise<BibleVerse> => {
    const data = await this.repository.getVerseById(id);
    return data;
  };

  postTranslationService = async (fileString: string): Promise<void> => {
    const parser =
      this.translationParserFactory.createTranslationParser(fileString);
    const translation = await parser.getTranslation();
    const insertion = await this.repository.insertTranslation(translation);
    if (!insertion) {
      throw new ConflictError('Translation already exists in datatabase');
    }
  };
}
