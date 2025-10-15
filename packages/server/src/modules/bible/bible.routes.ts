/*
/ap/bible...
GET verse/:id
GET text/translations
GET /text/translation/:translation
GET /text/translation/:translation/book/:book
GET /text/translation/:translation/book/:book/chapter/:chapter
GET /text/translation/:translation/book/:book/chapter/:chapter/verse/:verse
PUT /text/translation/upload
*/

import express, { Router } from 'express';
import BibleController from './bible.controller.js';

export const router: Router = express.Router();

const controller = new BibleController();

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

router.get('/test-data', controller.parseData);
