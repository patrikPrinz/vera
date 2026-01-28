import { injectable, inject } from 'tsyringe';
import express from 'express';
import type { Router, Request, Response, NextFunction } from 'express';
import type { BibleController } from './bible.controller.js';

import {
  getBooksSchema,
  getChaptersSchema,
  getMetadataSchema,
  getVerseSchema,
  getVersesSchema,
} from './bible.schema.js';

import type { ZodType } from 'zod';
import multer from 'multer';

@injectable()
export class BibleRouterFactory {
  public static createRouter(
    @inject('BibleController') controller: BibleController,
    @inject('requestValidator')
    requestValidator: <T extends ZodType>(
      schema: T,
    ) => (req: Request, _res: Response, next: NextFunction) => void,
  ): Router {
    const upload = multer({
      storage: multer.memoryStorage(),
    });

    const router: Router = express.Router();

    router.get(
      '/translation/:translation',
      requestValidator(getMetadataSchema),
      controller.getMetadata,
    );
    router.get(
      '/text/verse/:id',
      requestValidator(getVerseSchema),
      controller.getVerse,
    );
    router.get('/translations', controller.getTranslations);
    router.get(
      '/translation/:translation/books',
      requestValidator(getBooksSchema),
      controller.getBooks,
    );
    router.get(
      '/translation/:translation/book/:book/chapters',
      requestValidator(getChaptersSchema),
      controller.getChapters,
    );
    router.get(
      '/translation/:translation/book/:book/chapter/:chapter/verses',
      requestValidator(getVersesSchema),
      controller.getVerses,
    );

    router.post(
      '/translation',
      upload.single('translation'),
      controller.postTranslation,
    );

    return router;
  }
}
