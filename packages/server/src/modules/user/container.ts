import type { DependencyContainer } from 'tsyringe';
import { UserController } from './user.controller.js';
import { BookmarkRepository } from './repositories/bookmark.repository.js';
import { VerseMetadataRepository } from './repositories/verseMetadata.repository.js';
import { UserService } from './user.service.js';

export function registerUserContainer(container: DependencyContainer) {
  container.register('BookmarkRepository', BookmarkRepository);
  container.register('VerseMetadataRepository', VerseMetadataRepository);
  container.register('UserService', UserService);
  container.register('UserController', UserController);
}
