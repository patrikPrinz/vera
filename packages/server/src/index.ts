import express from 'express';

import { bibleServiceInjector, router } from './modules/bible/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

const bibleRouter = router;
app.use('/api/bible', bibleServiceInjector, bibleRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
