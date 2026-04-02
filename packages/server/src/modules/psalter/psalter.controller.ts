import { inject, injectable } from 'tsyringe';
import { PsalterService } from './psalter.service.js';
import type { ValidatedRequest } from '../../shared/request_validator/request_validator.types.js';
import type z from 'zod';
import type { psalterRequestSchema } from './psalter.schema.js';
import type { NextFunction, Response } from 'express';

@injectable()
export class PsalterController {
  protected psalterService: PsalterService;

  constructor(@inject('PsalterService') psalterService: PsalterService) {
    this.psalterService = psalterService;
  }

  getPsalm = async (
    req: ValidatedRequest<z.infer<typeof psalterRequestSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { language, number } = req.validated;
    const psalmData = await this.psalterService.getPsalm(
      language,
      new Number(number) as number,
    );

    res.json(psalmData);
  };

  getKathisma = async (
    req: ValidatedRequest<z.infer<typeof psalterRequestSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { language, number } = req.validated;
    const kathismaData = await this.psalterService.getKathisma(
      language,
      new Number(number) as number,
    );

    res.json(kathismaData);
  };
}
