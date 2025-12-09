import { GenericContainer } from 'testcontainers';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { estypes } from '@elastic/elasticsearch';

export const MAPPINGS: estypes.IndicesCreateRequest[] = [
  {
    index: 'bible',
    mappings: {
      properties: {
        translation: { type: 'keyword' },
        book: { type: 'integer' },
        chapter: { type: 'integer' },
        verse: { type: 'integer' },
        text: { type: 'text' },
        is_header: { type: 'boolean' },
      },
    },
  },
  {
    index: 'translation_metadata',
    mappings: {
      properties: {
        code: { type: 'keyword' },
        language: { type: 'keyword' },
        date: { type: 'date' },
        creator: { type: 'text' },
        source: { type: 'text' },
        books: {
          type: 'nested',
          properties: {
            bookNumber: { type: 'integer' },
            name: { type: 'text' },
            code: { type: 'keyword' },
          },
        },
      },
    },
  },
];

export async function startElasticContainer() {
  const elasticContainer = await new GenericContainer('elasticsearch:9.1.2')
    .withEnvironment({
      ELASTIC_PASSWORD: process.env.ELASTIC_PASSWORD || '',
      'discovery.type': 'single-node',
      ELASTIC_USERNAME: 'elastic',
      'xpack.security.enabled': 'false',
      'xpack.security.http.ssl.enabled': 'false',
      'http.cors.enabled': 'true',
      'http.cors.allow-origin': 'http://localhost:3000',
      'http.cors.allow-credentials': 'true',
      ES_JAVA_OPTS: '-Xms1g -Xmx1g',
    })
    .withExposedPorts(9200)
    .start();

  const host = elasticContainer.getHost();
  const port = elasticContainer.getMappedPort(9200);

  console.log(`Container is running on ${host}:${port}`);
  return elasticContainer;
}

export async function initializeIndices(
  elasticUrl: string,
  filename: string,
  mapping: estypes.IndicesCreateRequest,
) {
  const ndjson = fs.readFileSync(
    `${process.cwd()}/tests/integration/__fixtures__/${filename}.ndjson`,
    'utf-8',
  );

  await fetch(`${elasticUrl}/${filename}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mappings: mapping.mappings,
    }),
  });

  await fetch(`${elasticUrl}/_bulk?refresh=true`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-ndjson' },
    body: ndjson,
  });
}
