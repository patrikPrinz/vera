import { inject, injectable } from 'tsyringe';
import express, { type RequestHandler } from 'express';
import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { type AuthController } from './auth.controller.js';
import type { ZodType } from 'zod';
import { postRegisterSchema } from './auth.schema.js';

@injectable()
export class AuthRouterFactory {
  public static createRouter(
    @inject('AuthController') controller: AuthController,
    @inject('requestValidator')
    requestValidator: <T extends ZodType>(
      schema: T,
      part: string,
    ) => (req: Request, _res: Response, next: NextFunction) => void,
    @inject('authMiddleware')
    authenticated: (req: Request, _res: Response, next: NextFunction) => void,
  ) {
    const router: Router = express.Router();

    router.post(
      '/register',
      requestValidator(postRegisterSchema, 'body'),
      controller.postRegister,
    );

    router.post(
      '/login',
      passport.authenticate('local') as RequestHandler,
      controller.postAuthenticate,
    );

    router.post('/logout', authenticated, controller.postLogout);

    router.get(
      '/me',

      authenticated,
      controller.getMe,
    );

    return router;
  }
}
