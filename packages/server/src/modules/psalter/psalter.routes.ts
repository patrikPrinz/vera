import express, {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from 'express';
import { injectable, inject } from 'tsyringe';
import type { ZodType } from 'zod';
import type { PsalterController } from './psalter.controller.js';
import { listPsalmsSchema, psalterRequestSchema } from './psalter.schema.js';
import multer from 'multer';
import { authenticated } from '../../shared/auth/auth.middleware.js';

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

    const upload = multer({
      storage: multer.memoryStorage(),
    });

    router.get(
      '/psalms',
      requestValidator(listPsalmsSchema, 'query'),
      psalterController.listPsalms,
    );

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

    router.post(
      '/import',
      upload.single('psalter'),
      authenticated,
      psalterController.importPsalter,
    );

    return router;
  }
}
