import express, { Router } from 'express';
import multer from 'multer';

import BibleController from './bible.controller.js';
import {
  bibleServiceInjector,
  TranslationParserInjector,
} from './bible.middleware.js';

export const router: Router = express.Router();

const controller = new BibleController();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.use(bibleServiceInjector);

router.get('/translation/:translation', controller.getMetadata);
router.get('/text/verse/:id', controller.getVerse);
router.get('/translations', controller.getTranslations);
router.get('/translation/:translation/books', controller.getBooks);
router.get(
  '/translation/:translation/book/:book/chapters',
  controller.getChapters,
);
router.get(
  '/translation/:translation/book/:book/chapter/:chapter/verses',
  controller.getVerses,
);

router.post(
  '/translation',
  upload.single('translation'),
  TranslationParserInjector,
  controller.uploadTranslation,
);
