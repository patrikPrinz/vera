import express, { Router } from 'express';
import multer from 'multer';

import BibleController from './bible.controller.js';
import BibleRepository from './bible.repository.js';
import { elasticAdapter } from '../../shared/es/elastic_provider.js';
import { requestValidator } from '../../shared/request_validator/request_validator.js';
import {
  getBooksSchema,
  getChaptersSchema,
  getMetadataSchema,
  getVerseSchema,
  getVersesSchema,
} from './bible.schema.js';
import { BibleService } from './bible.service.js';

export const router: Router = express.Router();

const repository = new BibleRepository(elasticAdapter);
const service = new BibleService(repository);
const controller = new BibleController(service);

const upload = multer({
  storage: multer.memoryStorage(),
});

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
