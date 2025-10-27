import { Request, Response } from 'express';
import { z } from 'zod';

import { ValidatedRequest } from '../../shared/request_validator/request_validator.types.js';
import {
  getBooksSchema,
  getMetadataSchema,
  getChaptersSchema,
  getVersesSchema,
  getVerseSchema,
} from './bible.schema.js';
import { BibleService } from './bible.service.js';

export default class BibleController {
  protected service: BibleService;

  constructor(service: BibleService) {
    this.service = service;
  }

  getMetadata = async (
    req: ValidatedRequest<z.infer<typeof getMetadataSchema>>,
    res: Response,
  ) => {
    const { translation } = req.validated;
    const data = await this.service.getMetadataService(translation);
    res.json(data);
  };

  getTranslations = async (_req: Request, res: Response) => {
    const data = await this.service.getTranslationsService();
    res.json(data);
  };

  getBooks = async (
    req: ValidatedRequest<z.infer<typeof getBooksSchema>>,
    res: Response,
  ) => {
    const { translation } = req.validated;
    const data = await this.service.getBooksService(translation);
    res.json(data);
  };

  getChapters = async (
    req: ValidatedRequest<z.infer<typeof getChaptersSchema>>,
    res: Response,
  ) => {
    const { translation, book } = req.validated;
    const data = await this.service.getChaptersService(translation, Number(book));
    res.json(data);
  };

  getVerses = async (
    req: ValidatedRequest<z.infer<typeof getVersesSchema>>,
    res: Response,
  ) => {
    const { translation, book, chapter } = req.validated;
    const data = await this.service.getVersesService(translation, Number(book), Number(chapter));
    res.json(data);
  };

  getVerse = async (
    req: ValidatedRequest<z.infer<typeof getVerseSchema>>,
    res: Response,
  ) => {
    const { id } = req.validated;
    const data = await this.service.getVerseService(id);
    console.log(data);
    res.json(data);
  };

  postTranslation = async (req: Request, res: Response) => {
    const fileString = req.file.buffer.toString()
    await this.service.postTranslationService(fileString);
    res.status(200).json({ result: 'OK' });
  };
}
