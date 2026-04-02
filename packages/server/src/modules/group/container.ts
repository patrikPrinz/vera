import type { DependencyContainer } from 'tsyringe';
import { PostRepository } from './repositories/post.repository.js';
import { PostService } from './services/post.service.js';
import { GroupController } from './group.controller.js';

export function registerGroupModule(container: DependencyContainer) {
  container.register('PostRepository', PostRepository);
  container.register('PostService', PostService);
  container.register('GroupController', GroupController);
}
