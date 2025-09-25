import express from 'express';

import { elasticAdapter } from './shared/es/index.js';
import ElasticPort from './shared/es/elastic_port.js';

const app = express();
const PORT = process.env.PORT || 3000;

const db = elasticAdapter as ElasticPort;
app.get('/es', (_res, res) => {
  res.send(db.address);
});

app.get('/health', async (_req, res) => {
  console.log('fd');
  res.send(await db.getDbInfo());
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
