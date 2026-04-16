import { inject, injectable } from 'tsyringe';
import { PsalterService } from './psalter.service.js';
import type { ValidatedRequest } from '../../shared/request_validator/request_validator.types.js';
import type z from 'zod';
import type {
  listPsalmsSchema,
  psalterRequestSchema,
} from './psalter.schema.js';
import type { NextFunction, Request, Response } from 'express';
import type { User } from '../auth/auth.types.js';
import type { PsalmRecord } from './psalter.types.js';

@injectable()
export class PsalterController {
  protected psalterService: PsalterService;

  constructor(@inject('PsalterService') psalterService: PsalterService) {
    this.psalterService = psalterService;
  }

  listPsalms = async (
    req: ValidatedRequest<z.infer<typeof listPsalmsSchema>>,
    res: Response,
    _next: NextFunction,
  ) => {
    const { language } = req.validated;
    const result = await this.psalterService.listPsalms(language);
    res.status(200).json(result);
  };

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

  importPsalter = async (req: Request, res: Response, _next: NextFunction) => {
    const fileString = req.file.buffer
      .toString()
      .split('\n')
      .map((e) => {
        return JSON.parse(e) as PsalmRecord;
      });
    await this.psalterService.importPsalter(req.user as User, fileString);
    res.status(200).json({ result: 'OK' });
  };
}
