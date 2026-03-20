import { useBibleStore } from '@/modules/bible/stores/bibleStore';
import type { BibleLocation } from '@/shared/types/bible/bible.types';

export function useBibleReferenceFormatter() {
  const bibleStore = useBibleStore();

  const formatBibleLocation = (
    l: BibleLocation,
    withTranslation: boolean = false,
  ): string => {
    const withoutTranslation = `${bibleStore.getBookMetadata(l.book)?.name} ${l.chapter}, ${l.verse}`;
    return withTranslation
      ? `${l.translation}: ${withoutTranslation}`
      : withoutTranslation;
  };

  return { formatBibleLocation };
}
