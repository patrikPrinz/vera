import { injectable, inject } from 'tsyringe';
import type { PostService } from './services/post.service.js';
import type { ValidatedRequest } from '../../shared/request_validator/request_validator.types.js';
import type { z } from 'zod/mini';
import type { idSchema, postSchema } from './group.schema.js';
import type { NextFunction, Response } from 'express';
import type { User } from '../auth/auth.types.js';

@injectable()
export class GroupController {
  protected PostService: PostService;

  constructor(@inject('PostService') postService: PostService) {
    this.PostService = postService;
  }

  findPost = async (
    req: ValidatedRequest<z.infer<typeof idSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { id } = req.validated;
    const result = await this.PostService.findPost(req.user as User, id);
    res.status(200).json(result);
  };

  listPosts = async (
    req: ValidatedRequest<z.infer<typeof idSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { id } = req.validated;
    const result = await this.PostService.listPosts(req.user as User, id);
    res.status(200).json(result);
  };

  createPost = async (
    req: ValidatedRequest<z.infer<typeof postSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { post } = req.validated;
    const result = await this.PostService.createPost(req.user as User, post);
    res.status(200).json(result);
  };

  archivePost = async (
    req: ValidatedRequest<z.infer<typeof idSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { id } = req.validated;
    const result = await this.PostService.archivePost(req.user as User, id);
    res.status(200).json(result);
  };
}
