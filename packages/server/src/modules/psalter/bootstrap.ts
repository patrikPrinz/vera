import type { ZodType } from 'zod';
import type { DependencyContainer } from 'tsyringe';
import type { Request, Response, NextFunction, Router } from 'express';
import type { PsalterController } from './psalter.controller.js';
import { PsalterRouterFactory } from './psalter.routes.js';

export function registerPsalterRouter(container: DependencyContainer): Router {
  const psalterController: PsalterController =
    container.resolve('PsalterController');
  const requestVlaidator: <T extends ZodType>(
    schema: T,
  ) => (req: Request, _res: Response, next: NextFunction) => void =
    container.resolve('requestValidator');
  return PsalterRouterFactory.createRouter(psalterController, requestVlaidator);
}
