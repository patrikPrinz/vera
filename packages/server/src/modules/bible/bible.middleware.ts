import BibleRepository from './bible.repository.js';
import { Response, NextFunction } from 'express';

import { elasticAdapter } from '../../shared/es/elastic_provider.js';
import { InjectionRequest } from './bible.types.js';

export const bibleServiceInjector = (
  req: InjectionRequest,
  _res: Response,
  next: NextFunction,
) => {
  req.repository = new BibleRepository(elasticAdapter);
  next();
};
