import ElasticAdapter from './elastic_adapter.js';

const ELASTIC_URL = process.env.ELASTIC_URL || 'http://elastic-search:9200'; // default pro docker-compose
console.log(`Creating connection: ${ELASTIC_URL}`);
export const elasticAdapter = new ElasticAdapter(
  ELASTIC_URL,
  'elastic',
  process.env.ELASTIC_PASSWORD,
);
