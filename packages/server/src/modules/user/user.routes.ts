import express, {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from 'express';
import { injectable, inject } from 'tsyringe';
import type { ZodType } from 'zod';
import type { UserController } from './user.controller.js';
import {
  bookmarkByIdSchema,
  createBookmarkSchema,
  bookmarksByTranslationSchema,
} from './user.schema.js';

@injectable()
export class UserRouterFactory {
  public static createRouter(
    @inject('UserController') controller: UserController,
    @inject('requestValidator')
    requestValidator: <T extends ZodType>(
      schema: T,
      part: string,
    ) => (req: Request, _res: Response, next: NextFunction) => void,
    @inject('authMiddleware')
    authenticated: (req: Request, _res: Response, next: NextFunction) => void,
  ): Router {
    const router: Router = express.Router();

    router.use(authenticated);

    router.post(
      '/bookmarks',
      requestValidator(createBookmarkSchema, 'body'),
      controller.createBookmark,
    );

    router.get(
      '/bookmarks/:translation',
      requestValidator(bookmarksByTranslationSchema, 'params'),
      controller.getBookmarks,
    );

    router.get(
      '/bookmark/:id',
      requestValidator(bookmarkByIdSchema, 'params'),
      controller.getBookmarkById,
    );

    router.delete(
      '/bookmarks/:id',
      requestValidator(bookmarkByIdSchema, 'params'),
      controller.deleteBookmark,
    );

    return router;
  }
}
