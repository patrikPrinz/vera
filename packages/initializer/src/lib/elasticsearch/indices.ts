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
  {
    index: 'psalm',
    mappings: {
      properties: {
        language: { type: 'keyword' },
        kathisma_number: { type: 'integer' },
        psalm_number: { type: 'integer' },
        title: { type: 'text' },
        text_segments: { type: 'text' },
        stasis_end: { type: 'boolean' },
      },
    },
  },
  {
    index: 'kathisma',
    mappings: {
      properties: {
        language: { type: 'keyword' },
        kathisma_number: { type: 'integer' },
      },
    },
  },
];
