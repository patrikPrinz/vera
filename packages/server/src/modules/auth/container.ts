import { type DependencyContainer } from 'tsyringe';
import { AuthRepository } from './repositories/auth.repository.js';
import { AuthService } from './services/auth.service.js';
import { AuthController } from './controllers/auth.controller.js';
import { RolesRepository } from './repositories/roles.repository.js';
import { GroupsRepository } from './repositories/groups.repository.js';
import { UsersRepository } from './repositories/users.repository.js';
import { GroupsService } from './services/groups.service.js';
import { RolesService } from './services/roles.service.js';
import { UsersService } from './services/users.service.js';
import { AdminController } from './controllers/admin.controller.js';

export function registerAuthModule(container: DependencyContainer) {
  container.register('RolesRepository', RolesRepository);
  container.register('GroupsRepository', GroupsRepository);
  container.register('UsersRepository', UsersRepository);
  container.register('AuthRepository', AuthRepository);
  container.register('AuthService', AuthService);
  container.register('RolesService', RolesService);
  container.register('UsersService', UsersService);
  container.register('GroupsService', GroupsService);
  container.register('AuthController', AuthController);
  container.register('AdminController', AdminController);
}
