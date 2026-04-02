import bodyParser from 'body-parser';
import cors from 'cors';
import type { Express } from 'express';
import express from 'express';
import expressSession from 'express-session';

import { errorHandler } from './shared/error_handler/error_handler.js';

import passport from 'passport';
import { authContainer, bibleContainer, userContainer } from './container.js';
import {
  registerAuthRouter,
  registerAdminRouter,
} from './modules/auth/bootstrap.js';
import { registerBibleRouter } from './modules/bible/index.js';
import { registerUserRouter } from './modules/user/bootstrap.js';
import { container } from 'tsyringe';
import type { UsersService } from './modules/auth/services/users.service.js';

if (process.env.APP_ADMIN_LOGIN && process.env.APP_ADMIN_PASSWORD) {
  const usersService: UsersService = container.resolve('UsersService');
  await usersService.seedAdminUser(
    process.env.APP_ADMIN_LOGIN,
    process.env.APP_ADMIN_PASSWORD,
  );
}

const bibleRouter = registerBibleRouter(bibleContainer);
const authRouter = registerAuthRouter(authContainer);
const adminRouter = registerAdminRouter(authContainer);
const userRouter = registerUserRouter(userContainer);

const app: Express = express();

app.use(
  expressSession({
    name: 'vera_sid',
    secret: 'VeraAppSecret',
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', secure: false },
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

app.use(errorHandler);

export default app;
