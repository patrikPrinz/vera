import { inject, injectable } from 'tsyringe';
import express, { type RequestHandler } from 'express';
import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { type AuthController } from './controllers/auth.controller.js';
import type { ZodType } from 'zod';
import { hasRoleSchema, postRegisterSchema } from './auth.schema.js';
import type { AdminController } from './controllers/admin.controller.js';
import {
  createGroupSchema,
  findGroupSchema,
  getUserGroupsSchema,
  getUserRolesSchema,
  listGroupUsersSchema,
  manageRoleSchema,
  manageUserGroupSchema,
  updateGroupSchema,
} from './admin.schema.js';

@injectable()
export class AuthRouterFactory {
  public static createAuthRouter(
    @inject('AuthController') controller: AuthController,
    @inject('requestValidator')
    requestValidator: <T extends ZodType>(
      schema: T,
      part: string,
    ) => (req: Request, _res: Response, next: NextFunction) => void,
    @inject('authMiddleware')
    authenticated: (req: Request, _res: Response, next: NextFunction) => void,
  ) {
    const router: Router = express.Router();

    router.post(
      '/register',
      requestValidator(postRegisterSchema, 'body'),
      controller.postRegister,
    );

    router.post(
      '/login',
      passport.authenticate('local') as RequestHandler,
      controller.postAuthenticate,
    );

    router.post('/logout', authenticated, controller.postLogout);

    router.get('/me', authenticated, controller.getMe);

    router.post(
      '/has-roles',
      authenticated,
      requestValidator(hasRoleSchema, 'body'),
      controller.hasRoel,
    );

    return router;
  }

  public static createAdminRouter(
    @inject('AuthController') adminController: AdminController,
    @inject('requestValidator')
    requestValidator: <T extends ZodType>(
      schema: T,
      part: string,
    ) => (req: Request, _res: Response, next: NextFunction) => void,
    @inject('authMiddleware')
    authenticated: (req: Request, _res: Response, next: NextFunction) => void,
  ) {
    const router: Router = express.Router();

    router.use(authenticated);

    router.get('/users', adminController.listUsers);

    router.get('/groups', adminController.listGroups);

    router.get(
      '/group/:groupId',
      requestValidator(findGroupSchema, 'params'),
      adminController.findGroup,
    );

    router.post(
      '/groups',
      requestValidator(createGroupSchema, 'body'),
      adminController.createGroup,
    );

    router.delete(
      '/groups/:id',
      requestValidator(manageUserGroupSchema, 'params'),
      adminController.removeGroup,
    );

    router.put(
      '/groups/:id',
      requestValidator(updateGroupSchema, 'body'),
      adminController.updateGroup,
    );

    router.post(
      '/groups/assign',
      requestValidator(manageUserGroupSchema, 'body'),
      adminController.addToGroup,
    );

    router.post(
      '/groups/unassign',
      requestValidator(manageUserGroupSchema, 'body'),
      adminController.removeFromGroup,
    );

    router.get(
      '/group/:groupId/users',
      requestValidator(listGroupUsersSchema, 'params'),
      adminController.listGroupUsers,
    );

    router.get('/roles', adminController.listRoles);

    router.post(
      '/roles/assign',
      requestValidator(manageRoleSchema, 'body'),
      adminController.assignRole,
    );

    router.post(
      '/roles/unassign',
      requestValidator(manageRoleSchema, 'body'),
      adminController.unassignRole,
    );

    router.get(
      '/user-roles/:userId',
      requestValidator(getUserRolesSchema, 'params'),
      adminController.listUserRoles,
    );

    router.get(
      '/user-groups/:userId',
      requestValidator(getUserGroupsSchema, 'params'),
      adminController.listUserGroups,
    );

    return router;
  }
}
