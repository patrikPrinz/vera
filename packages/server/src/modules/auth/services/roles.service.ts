import { inject, injectable } from 'tsyringe';
import { PermissionError } from '../../../shared/error_handler/errors.js';
import type {
  Role,
  User,
  UserRole,
} from '../../../shared/types/auth/auth.types.js';
import type { RolesRepository } from '../repositories/roles.repository.js';

@injectable()
export class RolesService {
  protected repository: RolesRepository;
  constructor(@inject('RolesRepository') repository: RolesRepository) {
    this.repository = repository;
  }

  /**
   * Method checks if user has assigned any of these roles.
   *
   * If roles are not specified, it checks if user is admin.
   *
   * @param user
   * @param roles
   * @returns
   */
  public async hasRole(
    user: User,
    roles: string[] = ['admin'],
  ): Promise<boolean> {
    if (!roles.find((e) => e == 'admin')) {
      roles.push('admin');
    }
    return await this.repository.hasRole(user.id, roles);
  }

  public async listRoles(author: User) {
    if (await this.hasRole(author)) {
      const result = await this.repository.listRoles();
      return result;
    }
    throw new PermissionError('Not permitted to list roles.');
  }

  public async assignRole(author: User, userRole: UserRole) {
    if (await this.hasRole(author)) {
      const result = await this.repository.assignRole(
        userRole.userId,
        userRole.roleId,
      );
      return result;
    }
    throw new PermissionError('User not permitted to assign roles.');
  }

  public async unassignRole(author: User, userRole: UserRole) {
    if (await this.hasRole(author, ['admin'])) {
      const result = await this.repository.unassignRole(
        userRole.userId,
        userRole.roleId,
      );
      return result;
    }
    throw new PermissionError('User not permitted to unassign roles.');
  }

  public async listUserRoles(author: User, userId: string): Promise<Role[]> {
    console.log(author);
    console.log(userId);
    if (author.id == userId || (await this.hasRole(author))) {
      const result = await this.repository.listUserRoles(userId);
      return result;
    }
    throw new PermissionError('User not permitted to list user roles.');
  }
}
