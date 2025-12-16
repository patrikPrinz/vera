import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import {
  ParserError,
  TranslationParser,
  TranslationParserFactory,
  TranslationParserXml,
} from './translation_parser.js';
import { xmlData } from './__fixtures__/xmlData.js';
import type { BibleTranslationContainer } from '../bible.types.js';

function loadFixture(file: string) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const data = fs.readFileSync(`${__dirname}/__fixtures__/${file}`, 'utf-8');
  return data;
}

const validFull = JSON.parse(
  loadFixture('valid_full.json'),
) as BibleTranslationContainer;
validFull.metadata.date = new Date(validFull.metadata.date);

const xmlSamples = [
  [loadFixture('valid_simple.xml'), xmlData.valid_simple],
  [loadFixture('valid_full.xml'), validFull],
];

describe('Test XML parser.', () => {
  test.each(xmlSamples)(
    'Test XML parser with data.',
    async (input: string, translation: BibleTranslationContainer) => {
      const parser = new TranslationParserXml(input);
      expect(await parser.getTranslation()).toEqual(translation);
      expect(await parser.getData()).toEqual(translation.data);
      expect(await parser.getMetadata()).toEqual(translation.metadata);
    },
  );
  test('Test empty data.', async () => {
    const parser = new TranslationParserXml('');
    await expect(parser.getData()).rejects.toThrowError(ParserError);
  });
});

describe('Test parserProvider', () => {
  test('Test instance creation for XML', () => {
    const parser = new TranslationParserFactory().createTranslationParser(
      loadFixture('valid_simple.xml'),
    );
    expect(parser).toBeInstanceOf(TranslationParser);
    expect(parser).toBeInstanceOf(TranslationParserXml);
  });
});
