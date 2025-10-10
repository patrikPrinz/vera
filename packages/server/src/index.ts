import express from 'express';

import { elasticAdapter } from './shared/es/index.js';
import ElasticPort from './shared/es/elastic_port.js';
import { router } from './modules/bible/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

const db = elasticAdapter as ElasticPort;
app.get('/es', (_req, res) => {
  res.send(db.address);
});

app.get('/indices', async (_req, res) => {
  res.send(await db.listIndices());
});

app.get('/health', async (_req, res) => {
  console.log('fd');
  res.send(await db.getDbInfo());
});

const bibleRouter = router;
app.use('/api/bible', bibleRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
