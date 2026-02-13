import type { DependencyContainer } from 'tsyringe';
import { AuthRouterFactory } from './auth.routes.js';
import type { NextFunction, Router, Request, Response } from 'express';
import type { ZodType } from 'zod';
import type { AuthController } from './auth.controller.js';
import { registerPassportLocalStrategy } from './passport/local_strategy.js';

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
  return AuthRouterFactory.createRouter(
    controller,
    requestVlaidator,
    authMiddleware,
  );
}
