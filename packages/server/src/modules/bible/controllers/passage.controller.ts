import { injectable, inject } from 'tsyringe';
import type { PassageService } from '../services/passage.service.js';
import type { ValidatedRequest } from '../../../shared/request_validator/request_validator.types.js';
import type { createPassageSchema } from '../passage.schema.js';
import type { NextFunction, Response } from 'express';
import type { User } from '../../auth/auth.types.js';
import type z from 'zod';

@injectable()
export class PassageController {
  constructor(
    @inject('PassageService') private readonly passageService: PassageService,
  ) {}

  createPassage = (
    req: ValidatedRequest<z.infer<typeof createPassageSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { passage } = req.validated;
    const createdPassage = this.passageService.createPassage(
      req.user as User,
      passage,
    );
  };
}
