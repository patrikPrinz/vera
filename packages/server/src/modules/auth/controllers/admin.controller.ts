import { inject, injectable } from 'tsyringe';
import type { Group, User } from '../auth.types.js';
import type { GroupsService } from '../services/groups.service.js';
import type { UsersService } from '../services/users.service.js';
import type { Request, Response, NextFunction } from 'express';
import { AuthError } from '../../../shared/error_handler/errors.js';
import type { ValidatedRequest } from '../../../shared/request_validator/request_validator.types.js';
import {
  createGroupSchema,
  getUserGroupsSchema,
  getUserRolesSchema,
  listGroupUsersSchema,
  manageRoleSchema,
  manageUserGroupSchema,
  updateGroupSchema,
} from '../admin.schema.js';
import z from 'zod';
import type { RolesService } from '../services/roles.service.js';

@injectable()
export class AdminController {
  protected groupsService: GroupsService;
  protected usersService: UsersService;
  protected rolesService: RolesService;

  constructor(
    @inject('GroupsService') groupsService: GroupsService,
    @inject('UsersService') usersService: UsersService,
    @inject('RolesService') rolesService: RolesService,
  ) {
    this.groupsService = groupsService;
    this.usersService = usersService;
    this.rolesService = rolesService;
  }

  listGroups = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      const groups = await this.groupsService.listGroups(req.user as User);
      res.json(groups);
    } else {
      next(new AuthError());
    }
  };

  listUsers = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      const users = await this.usersService.listUsers(req.user as User);
      res.json(users);
    } else {
      next(new AuthError());
    }
  };

  // groups

  createGroup = async (
    req: ValidatedRequest<z.infer<typeof createGroupSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const group: Group = req.validated.group;
    const insertedGroup = await this.groupsService.createGroup(
      req.user as User,
      group,
    );
    res.json(insertedGroup);
  };

  removeGroup = async (
    req: ValidatedRequest<{ id: string }>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { id } = req.validated;
    const result = await this.groupsService.removeGroup(req.user as User, id);
    res.json({ deleted: result.toString() });
  };

  updateGroup = async (
    req: ValidatedRequest<z.infer<typeof updateGroupSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { group } = req.validated;
    const updatedGroup = await this.groupsService.updateGroup(
      req.user as User,
      group,
    );
    res.json(updatedGroup);
  };

  addToGroup = async (
    req: ValidatedRequest<z.infer<typeof manageUserGroupSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { userId, groupId } = req.validated;
    const result = await this.groupsService.addToGroup(
      req.user as User,
      userId,
      groupId,
    );
    res.json(result);
  };

  removeFromGroup = async (
    req: ValidatedRequest<z.infer<typeof manageUserGroupSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { userId, groupId } = req.validated;
    const result = await this.groupsService.removeFromGroup(
      req.user as User,
      userId,
      groupId,
    );
    res.json(result.toString());
  };

  listUserGroups = async (
    req: ValidatedRequest<z.infer<typeof getUserGroupsSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { userId } = req.validated;
    const groups = await this.groupsService.listUserGroups(
      req.user as User,
      userId,
    );
    res.json(groups);
  };

  listGroupUsers = async (
    req: ValidatedRequest<z.infer<typeof listGroupUsersSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { groupId } = req.validated;
    const groupUsers = await this.groupsService.listGroupUsers(
      req.user as User,
      groupId,
    );
    res.json(groupUsers);
  };

  // roles

  assignRole = async (
    req: ValidatedRequest<z.infer<typeof manageRoleSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { userRole } = req.validated;
    const result = await this.rolesService.assignRole(
      req.user as User,
      userRole,
    );
    res.json(result);
  };

  unassignRole = async (
    req: ValidatedRequest<z.infer<typeof manageRoleSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { userRole } = req.validated;
    const result = await this.rolesService.unassignRole(
      req.user as User,
      userRole,
    );
    res.json(result.toString());
  };

  listUserRoles = async (
    req: ValidatedRequest<z.infer<typeof getUserRolesSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { userId } = req.validated;
    const roles =
      (await this.rolesService.listUserRoles(req.user as User, userId)) ?? [];
    res.json(roles);
  };
}
