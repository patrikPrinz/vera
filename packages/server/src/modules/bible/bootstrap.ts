import type { ZodType } from 'zod';
import type { DependencyContainer } from 'tsyringe';
import type { Router, Request, Response, NextFunction } from 'express';
import { BibleRouterFactory } from './bible.routes.js';
import { BibleController } from './bible.controller.js';
import type { PassageController } from './controllers/passage.controller.js';

export function registerBibleRouter(container: DependencyContainer): Router {
  const controller: BibleController = container.resolve('BibleController');
  const passageController: PassageController =
    container.resolve('PassageController');
  const requestVlaidator: <T extends ZodType>(
    schema: T,
    part: string,
  ) => (req: Request, _res: Response, next: NextFunction) => void =
    container.resolve('requestValidator');
  const authMiddleware: (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => void = container.resolve('authMiddleware');
  return BibleRouterFactory.createRouter(
    controller,
    passageController,
    requestVlaidator,
    authMiddleware,
  );
}
