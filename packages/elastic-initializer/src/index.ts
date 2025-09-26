import { initializeIndex } from './lib/elasticsearch/elastic.js';
import { Client } from '@elastic/elasticsearch';
import type { estypes } from '@elastic/elasticsearch';

async function waitForElastic(connection: Client) {
  for (let i = 0; i < 10; i++) {
    try {
      await connection.ping();
      console.log('Elasticsearch is ready!');
      return;
    } catch {
      console.log('Waiting for elastic...');
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
  throw new Error('Elasticsearch not ready in time');
}

const connection = new Client({
  node: process.env.ELASTIC_NODE,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
});

const MAPPINGS: estypes.IndicesCreateRequest[] = [
  {
    index: 'bible',
    mappings: {
      properties: {
        language: { type: 'keyword' },
        translation: { type: 'keyword' },
        book: { type: 'keyword' },
        chapter: { type: 'integer' },
        verse: { type: 'integer' },
        is_header: { type: 'boolean' },
        text: { type: 'text' },
      },
    },
  },
];

await waitForElastic(connection);

for (const mapping of MAPPINGS) {
  await initializeIndex(connection, mapping);
}
