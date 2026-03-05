import type { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { UserService } from './user.service.js';
import type { User } from '../../shared/types/auth/auth.types.js';
import type { ValidatedRequest } from '../../shared/request_validator/request_validator.types.js';
import type z from 'zod';
import type {
  bookmarkByIdSchema,
  bookmarksByTranslationSchema,
  createBookmarkSchema,
} from './user.schema.js';
import type { Bookmark } from './user.types.js';

@injectable()
export class UserController {
  protected service: UserService;

  constructor(@inject('UserService') service: UserService) {
    this.service = service;
  }

  createBookmark = async (
    req: ValidatedRequest<z.infer<typeof createBookmarkSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const bookmark: Bookmark = req.validated;
    const result = await this.service.createBookmark(
      (req.user as User).id,
      bookmark,
    );
    res.status(200).json(result);
  };

  getBookmarks = async (
    req: ValidatedRequest<z.infer<typeof bookmarksByTranslationSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const result = await this.service.findUserBookmarks(
      (req.user as User).id,
      req.validated.translation,
    );
    res.status(200).json(result);
  };

  getBookmarkById = async (
    req: ValidatedRequest<z.infer<typeof bookmarkByIdSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    console.log(this.service);
    const result = await this.service.findBookmarkById(req.validated.id);
    res.json(result);
  };

  deleteBookmark = async (
    req: ValidatedRequest<z.infer<typeof bookmarkByIdSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const result = await this.service.deleteBookmark(
      (req.user as User).id,
      req.validated.id,
    );
    res.json(result);
  };
}
