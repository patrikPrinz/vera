import type { DependencyContainer } from 'tsyringe';
import { AuthRouterFactory } from './auth.routes.js';
import type { NextFunction, Router, Request, Response } from 'express';
import type { ZodType } from 'zod';
import type { AuthController } from './controllers/auth.controller.js';
import { registerPassportLocalStrategy } from './passport/local_strategy.js';
import type { AdminController } from './controllers/admin.controller.js';

export function registerAuthRouter(container: DependencyContainer): Router {
  registerPassportLocalStrategy();
  const controller: AuthController = container.resolve('AuthController');
  const authMiddleware: (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => void = container.resolve('authMiddleware');
  const requestVlaidator: <T extends ZodType>(
    schema: T,
    part: string,
  ) => (req: Request, _res: Response, next: NextFunction) => void =
    container.resolve('requestValidator');
  return AuthRouterFactory.createAuthRouter(
    controller,
    requestVlaidator,
    authMiddleware,
  );
}

export function registerAdminRouter(container: DependencyContainer): Router {
  const controller: AdminController = container.resolve('AdminController');
  const authMiddleware: (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => void = container.resolve('authMiddleware');
  const requestVlaidator: <T extends ZodType>(
    schema: T,
    part: string,
  ) => (req: Request, _res: Response, next: NextFunction) => void =
    container.resolve('requestValidator');
  return AuthRouterFactory.createAdminRouter(
    controller,
    requestVlaidator,
    authMiddleware,
  );
}
