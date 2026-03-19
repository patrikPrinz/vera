import { initializeIndex } from './lib/elasticsearch/elastic.js';
import { Client } from '@elastic/elasticsearch';

import { migrateToLatest } from './lib/postgres/postgres.js';
import { createMigrator, db } from './lib/postgres/migrator-provider.js';
import { MAPPINGS } from './lib/elasticsearch/indices.js';
import { waitForElastic } from './lib/elasticsearch/elastic.js';

const connection = new Client({
  node: process.env.ELASTIC_NODE,
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
});

const migrator = createMigrator(db);
await migrateToLatest(migrator);
if (process.env.ADMIN_USER_NAME) {
  await seedAdminUser(
    db,
    process.env.ADMIN_USER_NAME,
    process.env.ADMIN_USER_PASSWORD,
  );
}

await db.destroy();

await waitForElastic(connection);

for (const mapping of MAPPINGS) {
  await initializeIndex(connection, mapping);
}
