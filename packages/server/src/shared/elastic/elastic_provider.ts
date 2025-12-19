import ElasticAdapter from './elastic_adapter.js';

const ELASTIC_URL = process.env.ELASTIC_URL || 'http://elastic-search:9200';

export const elasticAdapter = new ElasticAdapter(
  ELASTIC_URL,
  'elastic',
  process.env.ELASTIC_PASSWORD,
);
