import { injectable, inject } from 'tsyringe';
import type { Request, Response, NextFunction } from 'express';
import type { ValidatedRequest } from '../../../shared/request_validator/request_validator.types.js';
import type { hasRoleSchema, postRegisterSchema } from '../auth.schema.js';
import z from 'zod';
import type { AuthService } from '../services/auth.service.js';
import { AppError, AuthError } from '../../../shared/error_handler/errors.js';
import type { User } from '../../../shared/types/auth/auth.types.js';
import { RolesService } from '../services/roles.service.js';

@injectable()
export class AuthController {
  protected service: AuthService;
  protected rolesService: RolesService;

  constructor(
    @inject('AuthService') service: AuthService,
    @inject('RolesService') rolesService: RolesService,
  ) {
    this.service = service;
    this.rolesService = rolesService;
  }

  public postAuthenticate = (
    _req: Request,
    res: Response,
    _next: NextFunction,
  ) => {
    res.status(200).json({ message: 'Authenticated.' });
  };

  public postLogout = (req: Request, res: Response, next: NextFunction) => {
    req.logOut((err) => {
      if (err) {
        next(new AppError());
      }
      res.status(200).json({ message: 'ok' }).send();
    });
  };

  public postRegister = async (
    req: ValidatedRequest<z.infer<typeof postRegisterSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { email, password, passwordCheck } = req.validated;
    const result = await this.service.postRegisterService(
      email,
      password,
      passwordCheck,
    );
    if (!result) {
      res.status(400).json({ message: 'Already registered with this method.' });
    }
    res.status(200).json({ message: 'ok' });
  };

  public getMe = async (req: Request, res: Response, _next: NextFunction) => {
    if (req.user) {
      const result = await this.service.getUserDetails((req.user as User).id);
      res.status(200).json(result);
    } else {
      throw new AuthError();
    }
  };

  public hasRoel = async (
    req: ValidatedRequest<z.infer<typeof hasRoleSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    if (req.user) {
      const result = await this.rolesService.hasRole(
        req.user as User,
        req.validated,
      );
      res.json(result);
    } else {
      throw new AuthError();
    }
  };
}
