import type { ZodType } from 'zod';
import type { DependencyContainer } from 'tsyringe';
import type { Router, Request, Response, NextFunction } from 'express';
import { BibleRouterFactory } from './bible.routes.js';
import { BibleController } from './bible.controller.js';

export function registerBibleRouter(container: DependencyContainer): Router {
  const controller: BibleController = container.resolve('BibleController');
  const requestVlaidator: <T extends ZodType>(
    schema: T,
  ) => (req: Request, _res: Response, next: NextFunction) => void =
    container.resolve('requestValidator');
  return BibleRouterFactory.createRouter(controller, requestVlaidator);
}
