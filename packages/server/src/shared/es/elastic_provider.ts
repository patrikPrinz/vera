import ElasticAdapter from './elastic_adapter.js';

export const elasticAdapter = new ElasticAdapter(
  'http://elastic-search:9200',
  'elastic',
  'pass',
);
