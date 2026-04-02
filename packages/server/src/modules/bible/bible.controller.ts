import type { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { z } from 'zod';

import type { ValidatedRequest } from '../../shared/request_validator/request_validator.types.js';
import {
  getBooksSchema,
  getMetadataSchema,
  getChaptersSchema,
  getVersesSchema,
  getVerseSchema,
} from './bible.schema.js';
import type { IBibleService } from './bible.interfaces.js';
import type { User } from '../auth/auth.types.js';

@injectable()
export class BibleController {
  protected service: IBibleService;

  constructor(@inject('BibleService') service: IBibleService) {
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
    const data = await this.service.getChaptersService(
      translation,
      Number(book),
    );
    res.json(data);
  };

  getVerses = async (
    req: ValidatedRequest<z.infer<typeof getVersesSchema>>,
    res: Response,
  ) => {
    const { translation, book, chapter } = req.validated;
    const data = await this.service.getVersesService(
      translation,
      Number(book),
      Number(chapter),
    );
    res.json(data);
  };

  getVerse = async (
    req: ValidatedRequest<z.infer<typeof getVerseSchema>>,
    res: Response,
  ) => {
    const { id } = req.validated;
    const data = await this.service.getVerseService(id);
    res.json(data);
  };

  postTranslation = async (req: Request, res: Response) => {
    const fileString = req.file.buffer.toString();
    await this.service.postTranslationService(req.user as User, fileString);
    res.status(200).json({ result: 'OK' });
  };
}
