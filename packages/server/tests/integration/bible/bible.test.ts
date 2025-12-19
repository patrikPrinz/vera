import {
  jest,
  describe,
  beforeAll,
  afterAll,
  test,
  expect,
} from '@jest/globals';
import fs from 'fs';
import { type StartedTestContainer } from 'testcontainers';
import request, { type Response } from 'supertest';
import type { Express } from 'express';
import {
  initializeIndices,
  startElasticContainer,
  MAPPINGS,
} from '../helpers/initialize_elastic.js';

process.env.ELASTIC_PASSWORD = 'pass';

describe('Bible module', () => {
  let app: Express;
  jest.setTimeout(120000);
  let elasticContainer: StartedTestContainer;
  beforeAll(async () => {
    elasticContainer = await startElasticContainer();
    const host = elasticContainer.getHost();
    const port = elasticContainer.getMappedPort(9200);

    process.env.ELASTIC_URL = `http://${host}:${port}`;
    const { default: importedApp } = await import('../../../src/bootstrap.js');
    app = importedApp;

    await initializeIndices(process.env.ELASTIC_URL, 'bible', MAPPINGS[0]);
    await initializeIndices(
      process.env.ELASTIC_URL,
      'translation_metadata',
      MAPPINGS[1],
    );
  });
  afterAll(async () => {
    await elasticContainer.stop();
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
  test('test XML file insertion', async () => {
    const fileData = fs.readFileSync(
      `${process.cwd()}/tests/integration/__fixtures__/translation.xml`,
      'utf-8',
    );
    const translationBuffer = Buffer.from(fileData);
    const res = await request(app)
      .post('/api/bible/translation')
      .attach('translation', translationBuffer, 'translation.xml');
    expect(res.statusCode).toEqual(200);
  });
  test('test XML translation conflict', async () => {
    const fileData = fs.readFileSync(
      `${process.cwd()}/tests/integration/__fixtures__/translation_conflict.xml`,
      'utf-8',
    );
    const translationBuffer = Buffer.from(fileData);
    const res = await request(app)
      .post('/api/bible/translation')
      .attach('translation', translationBuffer, 'translation_conflict.xml');
    expect(res.statusCode).toEqual(409);
  });
});
