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
  function getCurrentTranslation() {
    const storageData = localStorage.getItem('currentTranslation');
    if (!currentTranslation.value && storageData != null) {
      currentTranslation.value = storageData;
    }
    return currentTranslation.value;
  }

  function getTranslationMetadata() {
    return booksMetadata.value;
  }

  async function setCurrentTranslation(value: string) {
    const httpService = getBibleService();
    localStorage.setItem('currentTranslation', value ?? '');
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
    return getCurrentBook() !== undefined;
  }

  function getCurrentBook() {
    const storageData = localStorage.getItem('currentBook');
    if (!currentBook.value && storageData != null && storageData != '') {
      currentBook.value = new Number(storageData) as number;
    }
    return currentBook.value;
  }

  function setCurrentBook(value: number | undefined) {
    if (value === undefined || getBookMetadata(value)) {
      if (value) {
        localStorage.setItem('currentBook', value.toString());
      } else {
        localStorage.removeItem('currentBook');
      }
      currentBook.value = value;
    }
  }

  function isChapterSet() {
    return getCurrentChapter() !== undefined;
  }

  function getCurrentChapter() {
    const storageData = localStorage.getItem('currentChapter');
    if (!currentChapter.value && storageData != null && storageData != '') {
      currentChapter.value = new Number(storageData) as number;
    }
    return currentChapter.value;
  }

  function setCurrentChapter(value: number | undefined) {
    if (value) {
      localStorage.setItem('currentChapter', value.toString());
    } else {
      localStorage.removeItem('currentChapter');
    }
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
      setCurrentBook(undefined);
      setCurrentChapter(undefined);
    }
    const translation = getCurrentTranslation();
    if (!getTranslationMetadata() && translation) {
      await setCurrentTranslation(translation);
    }
  }

  return {
    currentTranslation,
    currentBook,
    currentChapter,
    translationMetadata,
    booksMetadata,

    getTranslationMetadata,
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
