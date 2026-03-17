import { inject, injectable } from 'tsyringe';
import type { Group, User } from '../auth.types.js';
import type { GroupsService } from '../services/groups.service.js';
import type { UsersService } from '../services/users.service.js';
import type { Request, Response, NextFunction } from 'express';
import { AuthError } from '../../../shared/error_handler/errors.js';
import type { ValidatedRequest } from '../../../shared/request_validator/request_validator.types.js';
import {
  createGroupSchema,
  manageRoleSchema,
  manageUserGroupSchema,
  updateGroupSchema,
} from '../admin.schema.js';
import z from 'zod';

@injectable()
export class AdminController {
  protected groupsService: GroupsService;
  protected usersService: UsersService;

  constructor(
    @inject('GroupsService') groupsService: GroupsService,
    @inject('UsersService') usersService: UsersService,
  ) {
    this.groupsService = groupsService;
    this.usersService = usersService;
  }

  listGroups = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      const groups = await this.groupsService.listGroups(req.user as User);
      res.json(groups);
    }
    next(new AuthError());
  };

  listUsers = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      const users = await this.usersService.listUsers(req.user as User);
      res.json(users);
    }
    next(new AuthError());
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
    res.json({ deleted: result });
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
    res.json(result);
  };

  // roles

  assignRole = async (
    req: ValidatedRequest<z.infer<typeof manageRoleSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { userId, roleId } = req.validated;
    const result = await this.groupsService.addToGroup(
      req.user as User,
      userId,
      roleId,
    );
    res.json(result);
  };

  unassignRole = async (
    req: ValidatedRequest<z.infer<typeof manageRoleSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { userId, roleId } = req.validated;
    const result = await this.groupsService.removeFromGroup(
      req.user as User,
      userId,
      roleId,
    );
    res.json(result);
  };
}
