import express from 'express';

import { router as bibleRouter } from './modules/bible/index.js';
import { errorHandler } from './shared/error_handler/error_handler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/bible', bibleRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
