import express from 'express';

import { router as bibleRouter } from './modules/bible/index.js';
import { errorHandler } from './shared/error_handler/error_handler.js';
import cors from 'cors';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());

app.use('/api/bible', bibleRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
