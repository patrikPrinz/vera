import { injectable, inject } from 'tsyringe';
import type { PassageService } from '../services/passage.service.js';
import type { ValidatedRequest } from '../../../shared/request_validator/request_validator.types.js';
import type {
  passageRequestSchema,
  findPassageSchema,
  deletePassageSchema,
  findUserPassagesSchema,
} from '../passage.schema.js';
import type { NextFunction, Response } from 'express';
import type { User } from '../../auth/auth.types.js';
import type z from 'zod';

@injectable()
export class PassageController {
  constructor(
    @inject('PassageService') private readonly passageService: PassageService,
  ) {}

  createPassage = async (
    req: ValidatedRequest<z.infer<typeof passageRequestSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { passage } = req.validated;
    const createdPassage = await this.passageService.createPassage(
      req.user as User,
      passage,
    );
    res.status(200).json(createdPassage);
  };

  findPassageByAuthor = async (
    req: ValidatedRequest<z.infer<typeof findUserPassagesSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { id } = req.validated;
    const result = await this.passageService.findPassagesByAuthor(
      req.user as User,
      id,
    );
    res.status(200).json(result);
  };

  findPassageById = async (
    req: ValidatedRequest<z.infer<typeof findPassageSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { param } = req.validated;
    const passage = await this.passageService.findPassageById(
      req.user as User,
      param,
    );
    res.status(200).json(passage);
  };

  findPassagesByDate = async (
    req: ValidatedRequest<z.infer<typeof findPassageSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { param } = req.validated;
    const passages = await this.passageService.findPassagesByDate(param);
    res.status(200).json(passages);
  };

  updatePassage = async (
    req: ValidatedRequest<z.infer<typeof passageRequestSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { passage } = req.validated;
    const response = await this.passageService.updatePassage(
      req.user as User,
      passage,
    );
    res.status(200).json(response);
  };

  deletePassage = async (
    req: ValidatedRequest<z.infer<typeof deletePassageSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { id } = req.validated;
    const response = await this.passageService.deletePassage(
      req.user as User,
      id,
    );
    res.status(200).json(response);
  };
}
