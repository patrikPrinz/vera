import { GenericContainer } from 'testcontainers';

export async function startPostgresContainer() {
  const postgresContainer = await new GenericContainer('postgres:18')
    .withEnvironment({
      POSTGRES_PASSWORD: 'pass',
    })
    .withExposedPorts(5432)
    .start();

  // const host = postgresContainer.getHost();
  // const port = postgresContainer.getMappedPort(5432);

  return postgresContainer;
}
