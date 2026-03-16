import { inject, injectable } from 'tsyringe';
import type { UsersRepository } from '../repositories/users.repository.js';
import type { RolesService } from './roles.service.js';
import { PermissionError } from '../../../shared/error_handler/errors.js';
import type { User } from '../auth.types.js';

@injectable()
export class UsersService {
  protected repository: UsersRepository;
  protected rolesService: RolesService;

  constructor(
    @inject('UsersRepository') repository: UsersRepository,
    @inject('RolesService') rolesService: RolesService,
  ) {
    this.repository = repository;
    this.rolesService = rolesService;
  }

  public async listUsers(user: User) {
    if (await this.rolesService.hasRole(user)) {
      const result = await this.repository.listUsers();
      return result;
    }
    throw new PermissionError('Not permitted to list users.');
  }
}
