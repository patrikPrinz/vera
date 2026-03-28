import express, {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from 'express';
import { injectable, inject } from 'tsyringe';
import type { ZodType } from 'zod';
import { idSchema } from '../user/user.schema.js';
import type { GroupController } from './group.controller.js';
import { postSchema } from './group.schema.js';

@injectable()
export class GroupRouterFactory {
  public static createGroupRouter(
    @inject('GroupController') controller: GroupController,
    @inject('requestValidator')
    requestValidator: <T extends ZodType>(
      schema: T,
      part: string,
    ) => (req: Request, _res: Response, next: NextFunction) => void,
    @inject('authMiddleware')
    authenticated: (req: Request, _res: Response, next: NextFunction) => void,
  ) {
    const router: Router = express.Router();

    router.use(authenticated);

    router.get(
      '/post/:id',
      requestValidator(idSchema, 'params'),
      controller.findPost,
    );

    router.get(
      '/:id/posts',
      requestValidator(idSchema, 'params'),
      controller.listPosts,
    );

    router.post(
      '/post',
      requestValidator(postSchema, 'body'),
      controller.createPost,
    );

    router.post(
      '/post/:id/archive',
      requestValidator(idSchema, 'params'),
      controller.archivePost,
    );

    return router;
  }
}
