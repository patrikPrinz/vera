import express from 'express';
import type { Express } from 'express';
import cors from 'cors';

import { errorHandler } from './shared/error_handler/error_handler.js';

import { bibleContainer } from './container.js';
import { registerBibleRouter } from './modules/bible/index.js';

const bibleRouter = registerBibleRouter(bibleContainer);

const app: Express = express();

app.use(cors());

app.use('/api/bible', bibleRouter);

app.use(errorHandler);

export default app;
