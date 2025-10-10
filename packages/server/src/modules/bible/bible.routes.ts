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
import BibleRepository from './bible.repository.js';
import { elasticAdapter } from '../../shared/es/elastic_provider.js';

export const router: Router = express.Router();

const controller = new BibleController(new BibleRepository(elasticAdapter));

router.get('/translations', async (_req, res) => {
  const result = await controller.getTranslations();
  res.send(result);
});

router.get('/test-data', async (_req, res) => {
  const result = await controller.parseData();
  res.send(result);
});
