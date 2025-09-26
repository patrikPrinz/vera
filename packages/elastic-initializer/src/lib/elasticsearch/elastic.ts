import { Client } from '@elastic/elasticsearch';
import type { estypes } from '@elastic/elasticsearch';

export async function initializeIndex(
  connection: Client,
  index: estypes.IndicesCreateRequest,
): Promise<void> {
  const exists = await connection.indices.exists({ index: index.index });
  if (!exists) {
    console.log(`Creating index ${index.index}...`);
    await connection.indices.create(index);
  }
  else {
    console.log(`Skipping. Index ${index.index} already exists.`);
  }
}
