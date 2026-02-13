import { type DependencyContainer } from 'tsyringe';
import { AuthRepository } from './auth.repository.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';

export function registerAuthModule(container: DependencyContainer) {
  container.register('AuthRepository', AuthRepository);
  container.register('AuthService', AuthService);
  container.register('AuthController', AuthController);
}
