import express from 'express';

import { router as bibleRouter } from './modules/bible/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api/bible', bibleRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
