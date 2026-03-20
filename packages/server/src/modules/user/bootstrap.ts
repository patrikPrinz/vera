import type { NextFunction, Router, Request, Response } from 'express';
import type { DependencyContainer } from 'tsyringe';
import { UserRouterFactory } from '../user/user.routes.js';
import type { ZodType } from 'zod';
import type { UserController } from './user.controller.js';

export function registerUserRouter(container: DependencyContainer): Router {
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
  const controller: UserController = container.resolve('UserController');
  return UserRouterFactory.createRouter(
    controller,
    requestVlaidator,
    authMiddleware,
  );
}
