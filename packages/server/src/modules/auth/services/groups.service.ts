import { inject, injectable } from 'tsyringe';
import type { GroupsRepository } from '../repositories/groups.repository.js';
import { RolesService } from './roles.service.js';
import type { User, Group } from '../auth.types.js';
import {
  AppError,
  NotFoundError,
  PermissionError,
} from '../../../shared/error_handler/errors.js';

@injectable()
export class GroupsService {
  protected repository: GroupsRepository;
  protected rolesService: RolesService;

  constructor(
    @inject('GroupsRepository') repository: GroupsRepository,
    @inject('RolesService') rolesService: RolesService,
  ) {
    this.repository = repository;
    this.rolesService = rolesService;
  }

  public async createGroup(user: User, group: Group): Promise<Group> {
    if (await this.rolesService.hasRole(user)) {
      const result = await this.repository.insertGroup(group);
      if (result) {
        group.id = result;
        return group;
      }
      throw new AppError(500, 'SERVER_ERROR', 'Group creation failed.');
    }
    throw new PermissionError('Not allowed to create a new group.');
  }

  public async removeGroup(user: User, groupId: string): Promise<bigint> {
    if (await this.rolesService.hasRole(user)) {
      const result = await this.repository.deleteGroup(groupId);
      if (result > 0) {
        return result;
      }
      throw new NotFoundError('Group not found.');
    }
    throw new PermissionError('Not allowed to remove group.');
  }

  public async updateGroup(user: User, group: Group): Promise<Group> {
    if (await this.rolesService.hasRole(user)) {
      const result = await this.repository.updateGroup(group);
      if (result) {
        return group;
      }
      throw new NotFoundError('Group not found.');
    }
    throw new PermissionError('Not allowed to remove group.');
  }

  public async listGroups(user: User) {
    if (await this.rolesService.hasRole(user)) {
      const result = await this.repository.listGroups();
      return result;
    }
    throw new PermissionError('Not allowed to list groups.');
  }

  public async addToGroup(author: User, userId: string, groupId: string) {
    if (await this.rolesService.hasRole(author)) {
      const result = await this.repository.addToGroup(userId, groupId);
      return result;
    }
    throw new PermissionError('User not permitted to assign roles.');
  }

  public async removeFromGroup(author: User, userId: string, groupId: string) {
    if (await this.rolesService.hasRole(author, ['admin'])) {
      const result = await this.repository.removeFromGroup(userId, groupId);
      if (result > 0) {
        return result;
      }
      throw new NotFoundError('Group not found.');
    }
    throw new PermissionError('User not permitted to unassign roles.');
  }
}
