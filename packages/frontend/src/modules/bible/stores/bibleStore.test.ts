import type { IBibleHttpService } from '../services/bibleHttp.service';
import { vi } from 'vitest';
import { setBibleService, useBibleStore } from './bibleStore';
import { createPinia, setActivePinia } from 'pinia';
import translationMetadataFixture from './__fixtures__/bibleMetadata.mock.json';

class BibleHttpServiceMock implements IBibleHttpService {
  public getTranslationMetadata = vi
    .fn()
    .mockResolvedValue(translationMetadataFixture);
  public getBibleBooks = vi.fn();
  public getBibleChapters = vi.fn();
  public getBibleVerses = vi.fn();
}

beforeEach(() => {
  setActivePinia(createPinia());
  setBibleService(new BibleHttpServiceMock());
});

test('before initialization', () => {
  const store = useBibleStore();
  expect(store.isBookSet()).toBe(false);
  expect(store.getBookMetadata(1)).toBe(undefined);
});

test('test initialization', async () => {
  const store = useBibleStore();
  await store.initialize();

  expect(store.getCurrentTranslation()).toBe('CZECEP');
  expect(store.getCurrentBook()).toBe(undefined);
  expect(store.getCurrentChapter()).toBe(undefined);
  expect(store.getBookMetadata(1)?.code).toBe('1Mo');
  expect(store.getBookMetadata(1000)).toBe(undefined);
});

test('book getter and setter', async () => {
  const store = useBibleStore();
  await store.initialize();
  expect(store.isBookSet()).toBe(false);
  expect(store.getCurrentBook()).toBe(undefined);
  store.setCurrentBook(1);
  expect(store.getCurrentBook()).toBe(1);
  expect(store.isBookSet()).toBe(true);
  store.setCurrentBook(undefined);
  expect(store.getCurrentBook()).toBe(undefined);
  store.setCurrentBook(1000);
  expect(store.getCurrentBook()).toBe(undefined);
});

test('chapter getter and setter', async () => {
  const store = useBibleStore();
  await store.initialize();
  expect(store.isChapterSet()).toBe(false);
  expect(store.getCurrentBook()).toBe(undefined);
  store.setCurrentChapter(1);
  expect(store.getCurrentChapter()).toBe(1);
  expect(store.isChapterSet()).toBe(true);
  store.setCurrentChapter(undefined);
  expect(store.getCurrentChapter()).toBe(undefined);
});
