import { inject, injectable } from 'tsyringe';
import type { UsersRepository } from '../repositories/users.repository.js';
import type { RolesService } from './roles.service.js';
import { PermissionError } from '../../../shared/error_handler/errors.js';
import type { User } from '../auth.types.js';
import type { AuthService } from './auth.service.js';
import type { RolesRepository } from '../repositories/roles.repository.js';

@injectable()
export class UsersService {
  protected rolesRepository: RolesRepository;
  protected authService: AuthService;
  protected repository: UsersRepository;
  protected rolesService: RolesService;

  constructor(
    @inject('RolesRepository') rolesRepository: RolesRepository,
    @inject('AuthService') authService: AuthService,
    @inject('UsersRepository') repository: UsersRepository,
    @inject('RolesService') rolesService: RolesService,
  ) {
    this.authService = authService;
    this.rolesRepository = rolesRepository;
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

  /**
   * Create a user with global admin role if there is no user yet created
   *
   * Function shall be called from bootstrap when starting server with values
   * from .env file
   * @param login login (currently an email address)
   * @param password password for new administrator
   * @returns true if created user, false otherwise
   */
  public async seedAdminUser(
    login: string,
    password: string,
  ): Promise<boolean> {
    const users = await this.repository.listUsers();
    if (users.length > 0) {
      return false;
    }
    const userId = await this.authService.postRegisterService(
      login,
      password,
      password,
    );
    if (!userId) {
      return false;
    }
    const assignedRole = await this.rolesRepository.assignRole(userId, '1');
    return assignedRole ? true : false;
  }
}
