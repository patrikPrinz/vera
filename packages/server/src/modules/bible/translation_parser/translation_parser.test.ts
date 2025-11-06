import fs from 'fs';

import { ParserError, TranslationParserXml } from './translation_parser.js';
import { xmlData } from './__fixtures__/xmlData.js';
import {
  BibleTranslationContainer,
  BibleTranslationMetadata,
  BibleVerse,
} from '../bible.types.js';

function loadFixture(file: string) {
  const data = fs.readFileSync(`${__dirname}/__fixtures__/${file}`, 'utf-8');
  return data;
}

const validFull = JSON.parse(
  loadFixture('valid_full.json'),
) as BibleTranslationContainer;
validFull.metadata.date = new Date(validFull.metadata.date);

const xmlSamples = [
  [
    loadFixture('valid_simple.xml'),
    xmlData.valid_simple.data,
    xmlData.valid_simple.metadata,
  ],
  [loadFixture('valid_full.xml'), validFull.data, validFull.metadata],
];

describe('Test XML parser.', () => {
  test.each(xmlSamples)(
    'Test XML parser with data.',
    async (
      input: string,
      data: BibleVerse[],
      metadata: BibleTranslationMetadata,
    ) => {
      const parser = new TranslationParserXml(input);
      expect(await parser.getData()).toEqual(data);
      expect(await parser.getMetadata()).toEqual(metadata);
    },
  );
  test('Test empty data.', async () => {
    const parser = new TranslationParserXml('');
    await expect(parser.getData()).rejects.toThrowError(ParserError);
  });
});
