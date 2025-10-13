import express from 'express';

import { elasticAdapter } from './shared/es/index.js';
import ElasticPort from './shared/es/elastic_port.js';
import { bibleServiceInjector, router } from './modules/bible/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

const bibleRouter = router;
app.use('/api/bible', bibleServiceInjector, bibleRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
