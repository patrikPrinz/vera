import express from 'express';
import type { Express } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import expressSession from 'express-session';

import { errorHandler } from './shared/error_handler/error_handler.js';

import { registerBibleRouter } from './modules/bible/index.js';
import { bibleContainer, authContainer, userContainer } from './container.js';
import { registerAuthRouter } from './modules/auth/bootstrap.js';
import passport from 'passport';
import { registerUserRouter } from './modules/user/bootstrap.js';

const bibleRouter = registerBibleRouter(bibleContainer);
const authRouter = registerAuthRouter(authContainer);
const userRouter = registerUserRouter(userContainer);

const app: Express = express();

app.use(
  expressSession({
    secret: 'VeraAppSecret',
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', secure: false },
  }),
);
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

app.use('/api/bible', bibleRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.use(errorHandler);

export default app;
