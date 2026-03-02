import express, {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from 'express';
import { injectable, inject } from 'tsyringe';
import type { ZodType } from 'zod';

@injectable()
export class UserRouterFactory {
  public static createRouter(
    @inject('requestValidator')
    _requestValidator: <T extends ZodType>(
      schema: T,
      part: string,
    ) => (req: Request, _res: Response, next: NextFunction) => void,
    @inject('authMiddleware')
    authenticated: (req: Request, _res: Response, next: NextFunction) => void,
  ): Router {
    const router: Router = express.Router();

    router.use(authenticated);

    router.get('/bookmarks', (_req, res) => {
      res.send('dsfds');
    });

    return router;
  }
}
