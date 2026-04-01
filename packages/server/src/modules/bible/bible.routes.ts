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
import {
  passageRequestSchema,
  findPassageSchema,
  deletePassageSchema,
} from './passage.schema.js';
import { PassageController } from './controllers/passage.controller.js';

@injectable()
export class BibleRouterFactory {
  public static createRouter(
    @inject('BibleController') controller: BibleController,
    @inject('PassageController') passageController: PassageController,
    @inject('requestValidator')
    requestValidator: <T extends ZodType>(
      schema: T,
      part: string,
    ) => (req: Request, _res: Response, next: NextFunction) => void,
    @inject('authMiddleware')
    authenticated: (req: Request, _res: Response, next: NextFunction) => void,
  ): Router {
    const upload = multer({
      storage: multer.memoryStorage(),
    });

    const router: Router = express.Router();

    router.get(
      '/translation/:translation',
      requestValidator(getMetadataSchema, 'params'),
      controller.getMetadata,
    );
    router.get(
      '/text/verse/:id',
      requestValidator(getVerseSchema, 'params'),
      controller.getVerse,
    );
    router.get('/translations', controller.getTranslations);
    router.get(
      '/translation/:translation/books',
      requestValidator(getBooksSchema, 'params'),
      controller.getBooks,
    );
    router.get(
      '/translation/:translation/book/:book/chapters',
      requestValidator(getChaptersSchema, 'params'),
      controller.getChapters,
    );
    router.get(
      '/translation/:translation/book/:book/chapter/:chapter/verses',
      requestValidator(getVersesSchema, 'params'),
      controller.getVerses,
    );

    router.post(
      '/translation',
      authenticated,
      upload.single('translation'),
      controller.postTranslation,
    );

    router.post(
      '/passage',
      authenticated,
      requestValidator(passageRequestSchema, 'body'),
      passageController.createPassage,
    );

    router.get(
      '/passage/id/:param',
      authenticated,
      requestValidator(findPassageSchema, 'params'),
      passageController.findPassageById,
    );

    router.get(
      '/passage/date/:param',
      requestValidator(findPassageSchema, 'params'),
      passageController.findPassagesByDate,
    );

    router.put(
      '/passage',
      authenticated,
      requestValidator(passageRequestSchema, 'body'),
      passageController.updatePassage,
    );

    router.delete(
      'passage/:id',
      authenticated,
      requestValidator(deletePassageSchema, 'params'),
      passageController.deletePassage,
    );

    return router;
  }
}
