import { BibleController } from './bible.controller.js';
import { BibleRepository } from './bible.repository.js';
import { BibleService } from './bible.service.js';
import { TranslationParserFactory } from './translation_parser/translation_parser.js';

import type { DependencyContainer } from 'tsyringe';
export function registerBibleModule(container: DependencyContainer) {
  container.register('BibleRepository', BibleRepository);
  container.register('TranslationParserFactory', TranslationParserFactory);
  container.register('BibleService', BibleService);
  container.register('BibleController', BibleController);
}
