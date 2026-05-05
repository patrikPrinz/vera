import 'reflect-metadata';
import { closeDb } from '../../../src/bootstrap.js';
import {
  jest,
  describe,
  beforeAll,
  afterAll,
  test,
  expect,
} from '@jest/globals';
import { type StartedTestContainer } from 'testcontainers';
import request, { Agent, type Response } from 'supertest';
import type { Express } from 'express';
import {
  initializeIndices,
  startElasticContainer,
  MAPPINGS,
} from '../helpers/initialize_elastic.js';
import {
  startPostgresContainer,
  seedAdminUser,
} from '../helpers/initialize_postgres.js';
import { Kysely } from 'kysely';
import { Database } from '../../../src/shared/postgres/schema.js';
import createPassageRequest from '../__fixtures__/bible/create_passage_request.json';
import fs from 'fs';
import { rootContainer } from '../../../src/container.js';
import { PostgresAdapter } from '../../../src/shared/postgres/postgres_adapter.js';

process.env.ELASTIC_PASSWORD = 'pass';
process.env.NODE_ENV = 'test';

describe('Bible module', () => {
  let app: Express;
  jest.setTimeout(120000);
  let elasticContainer: StartedTestContainer;
  let postgres: StartedTestContainer;
  let db: Kysely<Database>;
  beforeAll(async () => {
    const c = await startPostgresContainer();
    postgres = c.container;
    process.env.POSTGRES_HOST = postgres.getHost();
    process.env.POSTGRES_PORT = postgres.getMappedPort(5432).toString();
    db = c.db;
    await seedAdminUser(db, 'admin@email.cz', 'password');

    elasticContainer = await startElasticContainer();
    const host = elasticContainer.getHost();
    const port = elasticContainer.getMappedPort(9200);
    process.env.ELASTIC_URL = `http://${host}:${port}`;
    await initializeIndices(process.env.ELASTIC_URL, 'bible', MAPPINGS[0]);
    await initializeIndices(
      process.env.ELASTIC_URL,
      'translation_metadata',
      MAPPINGS[1],
    );

    const { default: importedApp } = await import('../../../src/bootstrap.js');
    app = importedApp;
  });

  afterAll(async () => {
    console.log('DESTROY IT ALL.');
    await new Promise((resolve) => setImmediate(resolve));
    const appDb: PostgresAdapter = rootContainer.resolve('PostgresAdapter');
    await appDb.destroy();
    await db.destroy();
    rootContainer.clearInstances();
    rootContainer.reset();
    await elasticContainer.stop();
    await postgres.stop();
  });

  test('get translation metadata', async () => {
    const res = await request(app).get('/api/bible/translation/CZECEP').send();
    console.log(res.body);
    expect(res.statusCode).toEqual(200);
  });

  test('get translation metadata', async () => {
    const res = await request(app).get('/api/bible/translation/error').send();
    expect(res.statusCode).toEqual(404);
  });

  test('list translations', async () => {
    const res = await request(app).get('/api/bible/translations').send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([{ translation: 'CZECEP' }]);
  });

  test('list books for translation', async () => {
    const res: Response = await request(app)
      .get('/api/bible/translation/CZECEP/books')
      .send();
    expect(res.statusCode).toEqual(200);
    const body = res.body as unknown[];
    expect(body.length).toEqual(66);
    expect(body[0]).toEqual({ translation: 'CZECEP', book: 1 });
  });

  test('list chapters of book', async () => {
    const res = await request(app)
      .get('/api/bible/translation/CZECEP/book/1/chapters')
      .send();
    expect(res.statusCode).toEqual(200);
    const body = res.body as unknown[];
    expect(body.length).toEqual(50);
    expect(body[0]).toEqual({ translation: 'CZECEP', book: 1, chapter: 1 });
  });

  test('list verses', async () => {
    const res = await request(app)
      .get('/api/bible/translation/CZECEP/book/1/chapter/1/verses')
      .send();
    console.log(res.body);
    expect(res.statusCode).toEqual(200);
    const body = res.body as unknown[];
    expect(body[0]).toEqual(
      expect.objectContaining({
        book: 1,
        chapter: 1,
        verse: 1,
        text: 'Na počátku stvořil Bůh nebe a zemi.',
      }),
    );
  });

  test('non-existent chapter', async () => {
    const res = await request(app)
      .get('/api/bible/translation/CZECEP/book/1/chapter/1000/verses')
      .send();
    expect(res.statusCode).toEqual(404);
  });

  describe('test admin section after login', () => {
    let agent: Agent;

    beforeAll(async () => {
      agent = request.agent(app);
      // log in to the server
      await agent
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ login: 'admin@email.cz', password: 'password' })
        .withCredentials();
      console.log('DONE LOGGING IN!');
    });
    afterAll(() => {
      agent = null;
    });

    test('test XML file insertion', async () => {
      const fileData = fs.readFileSync(
        `${process.cwd()}/tests/integration/__fixtures__/bible/translation.xml`,
        'utf-8',
      );
      const translationBuffer = Buffer.from(fileData);
      const res = await agent
        .post('/api/bible/translation')
        .attach('translation', translationBuffer, 'bible/translation.xml');
      expect(res.statusCode).toEqual(200);
    });

    test('test XML translation conflict', async () => {
      const fileData = fs.readFileSync(
        `${process.cwd()}/tests/integration/__fixtures__/bible/translation_conflict.xml`,
        'utf-8',
      );
      const translationBuffer = Buffer.from(fileData);
      const res = await agent
        .post('/api/bible/translation')
        .attach(
          'translation',
          translationBuffer,
          'bible/translation_conflict.xml',
        );
      expect(res.statusCode).toEqual(409);
    });

    /*describe('test user passages', () => {
      test('passage insertion', async () => {
        const res = await agent
          .post('/api/bible/passage')
          .send(createPassageRequest);
        expect(res.statusCode).toEqual(200);
        const body = res.body as typeof createPassageRequest.passage;
        expect(body.title).toEqual('Úryvek');
        await new Promise((r) => setTimeout(r, 100));
      });
      });*/
  });
});
