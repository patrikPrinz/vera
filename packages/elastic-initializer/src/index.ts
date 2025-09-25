import { initializeIndex } from './lib/elasticsearch/elastic.js';
import { Client } from '@elastic/elasticsearch';
import type { estypes } from '@elastic/elasticsearch';

const connection = new Client({
  node: 'http://127.0.0.1:9200'
});

const MAPPINGS: estypes.IndicesCreateRequest[] = [
  {
    index: 'bible',
    mappings: {
      properties: {
        language: {type: 'keyword'},
        translation: {type: 'keyword'},
        book: {type: 'keyword'},
        chapter: {type: 'integer'},
        verse: {type: 'integer'},
        is_header: {type: 'boolean'},
        text: {type: 'text'}
      }
    }
  }
];

for (const mapping of MAPPINGS) {
  await initializeIndex(connection, mapping);
}