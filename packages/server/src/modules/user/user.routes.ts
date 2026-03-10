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
  idSchema,
  createBookmarkSchema,
  getByTranslationSchema,
  createVerseMetadataSchema,
  getByChapterSchema,
  updateVerseMetadataSchema,
  moveBookmarkSchema,
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
      requestValidator(getByTranslationSchema, 'params'),
      controller.getBookmarks,
    );

    router.get(
      '/bookmark/:id',
      requestValidator(idSchema, 'params'),
      controller.getBookmarkById,
    );

    router.delete(
      '/bookmarks/:id',
      requestValidator(idSchema, 'params'),
      controller.deleteBookmark,
    );

    router.put(
      '/bookmarks/move',
      requestValidator(moveBookmarkSchema, 'body'),
      controller.moveBookmark,
    );

    router.post(
      '/user-verse-metadata',
      requestValidator(createVerseMetadataSchema, 'body'),
      controller.createVerseMetadata,
    );

    router.delete(
      '/user-verse-metadata/:id',
      requestValidator(idSchema, 'params'),
      controller.deleteVerseMetadata,
    );

    router.get(
      '/user-verse-metadata/:id',
      requestValidator(idSchema, 'body'),
      controller.getVerseMetadataById,
    );

    router.get(
      '/user-verse-metadata',
      requestValidator(getByChapterSchema, 'query'),
      controller.getVerseMetadataByChapter,
    );

    router.put(
      '/user-verse-metadata',
      requestValidator(updateVerseMetadataSchema, 'body'),
      controller.updateVerseMetadata,
    );

    return router;
  }
}
