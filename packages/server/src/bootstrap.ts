import express from 'express';
import type { Express } from 'express';
import cors from 'cors';

import { router as bibleRouter } from './modules/bible/index.js';
import { errorHandler } from './shared/error_handler/error_handler.js';

const app: Express = express();

app.use(cors());

app.use('/api/bible', bibleRouter);

app.use(errorHandler);

export default app;
