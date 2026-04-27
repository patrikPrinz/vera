import bodyParser from 'body-parser';
import cors from 'cors';
import type { Express, NextFunction, Request, Response } from 'express';
import express from 'express';
import expressSession from 'express-session';
import createMemoryStore from 'memorystore';

import passport from 'passport';
import {
  authContainer,
  bibleContainer,
  userContainer,
  psalterContainer,
  groupContainer,
} from './container.js';
import {
  registerAdminRouter,
  registerAuthRouter,
} from './modules/auth/bootstrap.js';
import { registerBibleRouter } from './modules/bible/index.js';
import { registerPsalterRouter } from './modules/psalter/bootstrap.js';
import { registerUserRouter } from './modules/user/bootstrap.js';
import { registerGroupRouter } from './modules/group/bootstrap.js';
import { container } from 'tsyringe';

const MemoryStore = createMemoryStore(expressSession);
const bibleRouter = registerBibleRouter(bibleContainer);
const authRouter = registerAuthRouter(authContainer);
const adminRouter = registerAdminRouter(authContainer);
const userRouter = registerUserRouter(userContainer);
const psalterRouter = registerPsalterRouter(psalterContainer);
const groupRouter = registerGroupRouter(groupContainer);

const app: Express = express();

app.use(
  expressSession({
    name: 'vera_sid',
    secret: 'VeraAppSecret',
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 86400000,
    },
    store: new MemoryStore({ checkPeriod: 86400000 }),
  }),
);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

const domain = process.env.SERVER_ALLOWED_ORIGIN ?? 'localhost:3001';

app.use(
  cors({
    origin: [`http://${domain}`, `https://${domain}`],
    credentials: true,
  }),
);

app.use('/api/bible', bibleRouter);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/psalter', psalterRouter);
app.use('/api/group', groupRouter);

const errorHandler: (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => void = container.resolve('errorHandler');
app.use(errorHandler);

export default app;
