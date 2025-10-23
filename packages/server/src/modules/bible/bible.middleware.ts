import BibleRepository from './bible.repository.js';
import { Response, NextFunction } from 'express';

import { elasticAdapter } from '../../shared/es/elastic_provider.js';
import { InjectionRequest } from './bible.types.js';
import { translationParserProvider } from './translation_parser/translation_parser.js';

export const bibleServiceInjector = (
  req: InjectionRequest,
  _res: Response,
  next: NextFunction,
) => {
  if (req.context == undefined) {
    req.context = {};
  }
  req.context.repository = new BibleRepository(elasticAdapter);
  next();
};

export const TranslationParserInjector = (
  req: InjectionRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.context == undefined) {
    req.context = {};
  }
  //console.log(req.file.buffer.toString());
  //return;
  try {
    req.context.parser = translationParserProvider(req.file.buffer.toString());
    next();
  } catch(_error) {
    res.status(400).json({ error: 'File is missing.' });
  }
};
