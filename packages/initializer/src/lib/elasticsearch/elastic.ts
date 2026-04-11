import { Client } from '@elastic/elasticsearch';
import type { estypes } from '@elastic/elasticsearch';

export async function waitForElastic(connection: Client) {
  for (let i = 0; i < 30; i++) {
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

export async function initializeIndex(
  connection: Client,
  index: estypes.IndicesCreateRequest,
): Promise<void> {
  const exists = await connection.indices.exists({ index: index.index });
  if (!exists) {
    console.log(`Creating index ${index.index}...`);
    await connection.indices.create(index);
  } else {
    console.log(`Skipping. Index ${index.index} already exists.`);
  }
}
