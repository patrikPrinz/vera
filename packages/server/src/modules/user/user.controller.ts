import type { Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { UserService } from './user.service.js';
import type { User } from '../../shared/types/auth/auth.types.js';
import type { ValidatedRequest } from '../../shared/request_validator/request_validator.types.js';
import type z from 'zod';
import type {
  idSchema,
  getByTranslationSchema,
  createBookmarkSchema,
  createVerseMetadataSchema,
  getByChapterSchema,
  updateVerseMetadataSchema,
  moveBookmarkSchema,
} from './user.schema.js';
import type { Bookmark, UserVerseMetadata } from './user.types.js';
import type { BibleChapter } from '../bible/bible.types.js';

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
    req: ValidatedRequest<z.infer<typeof getByTranslationSchema>>,
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
    req: ValidatedRequest<z.infer<typeof idSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const result = await this.service.findBookmarkById(req.validated.id);
    res.json(result);
  };

  deleteBookmark = async (
    req: ValidatedRequest<z.infer<typeof idSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const result = await this.service.deleteBookmark(
      (req.user as User).id,
      req.validated.id,
    );
    res.json(result);
  };

  moveBookmark = async (
    req: ValidatedRequest<z.infer<typeof moveBookmarkSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { id, location } = req.validated;
    const result = await this.service.moveBookmark(
      (req.user as User).id,
      id,
      location,
    );
    res.json(result);
  };

  createVerseMetadata = async (
    req: ValidatedRequest<z.infer<typeof createVerseMetadataSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const metadata: UserVerseMetadata = req.validated;
    const result = await this.service.createVerseMetadata(
      (req.user as User).id,
      metadata,
    );
    res.json(result);
  };

  deleteVerseMetadata = async (
    req: ValidatedRequest<z.infer<typeof idSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const deletedMetadata = await this.service.deleteVerseMetadata(
      (req.user as User).id,
      req.validated.id,
    );
    res.json(deletedMetadata);
  };

  getVerseMetadataById = async (
    req: ValidatedRequest<z.infer<typeof idSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const result = await this.service.findVerseMetadataById(
      (req.user as User).id,
      req.validated.id,
    );
    res.json(result);
  };

  getVerseMetadataByChapter = async (
    req: ValidatedRequest<z.infer<typeof getByChapterSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { translation, book, chapter } = req.validated;
    const result = await this.service.findVerseMetadataByChapter(
      (req.user as User).id,
      {
        translation,
        book: new Number(book),
        chapter: new Number(chapter),
      } as BibleChapter,
    );
    res.json(result);
  };

  updateVerseMetadata = async (
    req: ValidatedRequest<z.infer<typeof updateVerseMetadataSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { id, noteText, highlightColor } = req.validated;
    const result = await this.service.editVerseMetadata(
      (req.user as User).id,
      id,
      noteText,
      highlightColor,
    );
    res.json(result);
  };
}
