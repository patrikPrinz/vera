import express, {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from 'express';
import { injectable, inject } from 'tsyringe';
import type { ZodType } from 'zod';
import type { PsalterController } from './psalter.controller.js';
import { psalterRequestSchema } from './psalter.schema.js';

@injectable()
export class PsalterRouterFactory {
  public static createRouter(
    @inject('UserController') psalterController: PsalterController,
    @inject('requestValidator')
    requestValidator: <T extends ZodType>(
      schema: T,
      part: string,
    ) => (req: Request, _res: Response, next: NextFunction) => void,
  ): Router {
    const router: Router = express.Router();

    router.get(
      '/psalm',
      requestValidator(psalterRequestSchema, 'query'),
      psalterController.getPsalm,
    );

    router.get(
      '/kathisma',
      requestValidator(psalterRequestSchema, 'query'),
      psalterController.getKathisma,
    );

    return router;
  }
}
