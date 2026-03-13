import type {
  BibleBookMetadata,
  BibleTranslationMetadata,
} from '@/shared/types/bible/bible.types';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import { httpClient } from '@/shared/httpClient/HttpProvider';
import {
  BibleHttpService,
  type IBibleHttpService,
} from '../services/bibleHttp.service';

export const useBibleStore = defineStore('bible', () => {
  const currentTranslation: Ref<string | undefined> = ref(undefined);
  const currentBook: Ref<number | undefined> = ref(undefined);
  const currentChapter: Ref<number | undefined> = ref(undefined);
  const translationMetadata: Ref<BibleTranslationMetadata | undefined> =
    ref(undefined);
  const booksMetadata: Ref<Record<number, BibleBookMetadata> | undefined> =
    ref(undefined);
  //const httpService = new BibleHttpPort(httpClient);

  function getCurrentTranslation() {
    return currentTranslation.value;
  }

  async function setCurrentTranslation(value: string) {
    const httpService = getBibleService();
    currentTranslation.value = value;
    const data = await httpService.getTranslationMetadata(
      currentTranslation.value,
    );
    translationMetadata.value = data;
    if (data && data.books) {
      booksMetadata.value = {};
      for (const book of data.books) {
        booksMetadata.value[book.bookNumber] = book;
      }
    }
  }

  function isBookSet() {
    return currentBook.value !== undefined;
  }

  function getCurrentBook() {
    return currentBook.value;
  }

  function setCurrentBook(value: number | undefined) {
    if (value === undefined || getBookMetadata(value)) {
      currentBook.value = value;
    }
  }

  function isChapterSet() {
    return currentChapter.value !== undefined;
  }

  function getCurrentChapter() {
    return currentChapter.value;
  }

  function setCurrentChapter(value: number | undefined) {
    currentChapter.value = value;
  }

  function getBookMetadata(id: number) {
    if (booksMetadata.value && booksMetadata.value[id]) {
      return booksMetadata.value[id];
    }
    return undefined;
  }

  async function listTranslations(): Promise<{ translation: string }[]> {
    if (bibleService) {
      const result = await bibleService.getTranslations();
      return result;
    }
    throw new ReferenceError('Bible service not provided.');
  }

  async function initialize() {
    if (!getCurrentTranslation()) {
      const translation = (import.meta.env.FALLBACK_TRANSLATION ??
        'CZECEP') as string;
      await setCurrentTranslation(translation);
      currentBook.value = undefined;
      currentChapter.value = undefined;
    }
  }

  return {
    currentTranslation,
    currentBook,
    currentChapter,
    translationMetadata,
    booksMetadata,

    getCurrentTranslation,
    setCurrentTranslation,
    isBookSet,
    getCurrentBook,
    setCurrentBook,
    isChapterSet,
    getCurrentChapter,
    setCurrentChapter,
    getBookMetadata,
    listTranslations,
    initialize,
  };
});

let bibleService: IBibleHttpService | null = null;

export function setBibleService(service: IBibleHttpService | null) {
  bibleService = service;
}

function getBibleService(): IBibleHttpService {
  if (!bibleService) {
    bibleService = new BibleHttpService(httpClient);
  }
  return bibleService;
}
