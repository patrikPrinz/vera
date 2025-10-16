import { TranslationParserXml } from './translation_parser.js';

import { xmlData } from './__fixtures__/xmlData.js';

import fs from 'fs';

function loadFixture(file: string) {
  const data = fs.readFileSync(`${__dirname}/__fixtures__/${file}`, 'utf-8');
  return data;
}

const xmlSamples = [[loadFixture('valid_simple.xml'), xmlData.valid_simple.data, xmlData.valid_simple.metadata]];

describe('Test XML parser.', () => {
  test.each(xmlSamples)('Test XML parser', async (input, data, metadata) => {
    const parser = new TranslationParserXml(input as string);
    expect(await parser.getData()).toEqual(data);
    expect(await parser.getMetadata()).toEqual(metadata);
  });
});
