import type { NextFunction, Router, Request, Response } from 'express';
import type { DependencyContainer } from 'tsyringe';
import type { GroupController } from './group.controller.js';
import type { ZodType } from 'zod';
import { GroupRouterFactory } from './group.routes.js';

export function registerGroupRouter(container: DependencyContainer): Router {
  const controller: GroupController = container.resolve('GroupController');
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
  return GroupRouterFactory.createGroupRouter(
    controller,
    requestVlaidator,
    authMiddleware,
  );
}
