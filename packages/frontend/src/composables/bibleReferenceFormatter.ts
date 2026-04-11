import { bibleService } from '@/modules/bible/services/bibleServices.provider';
import { useBibleStore } from '@/modules/bible/stores/bibleStore';
import type {
  BibleLocation,
  BibleVerse,
} from '@/shared/types/bible/bible.types';
import type {
  BiblePassage,
  PassageSegment,
} from '@/shared/types/bible/passage.types';

export function useBibleReferenceFormatter() {
  const bibleStore = useBibleStore();

  const formatBibleLocation = (
    l: BibleLocation,
    withTranslation: boolean = false,
  ): string => {
    const bookName = bibleStore.getBookMetadata(l.book)?.name;
    const withoutTranslation = `${bookName} ${l.chapter}, ${l.verse}`;
    return withTranslation
      ? `${l.translation}: ${withoutTranslation}`
      : withoutTranslation;
  };

  const formatBiblePassageLocation = async (
    l: BiblePassage,
  ): Promise<string> => {
    await bibleStore.initialize();
    const bookName = bibleStore.getBookMetadata(l.passageLocation.book)?.name;
    let location = `${bookName} `;
    for (const segment of l.passageLocation.segments) {
      location += formatPassageSegment(segment);
    }
    return location;
  };

  const formatPassageSegment = (s: PassageSegment): string => {
    const startPart = `${s.startChapter},${s.startVerse}`;
    const endPart =
      s.endVerse != s.startVerse ? `-${s.endChapter ?? ''},${s.endVerse}` : '';
    return startPart + endPart + '.';
  };

  const passageToText = async (
    passage: BiblePassage,
  ): Promise<BibleVerse[]> => {
    const book = passage.passageLocation.book;
    let resultText: BibleVerse[] = [];
    for (const segment of passage.passageLocation.segments) {
      resultText = resultText.concat(await segmentToText(book, segment));
    }
    return resultText;
  };

  const segmentToText = async (
    book: number,
    segment: PassageSegment,
  ): Promise<BibleVerse[]> => {
    const translation = bibleStore.getCurrentTranslation() ?? '';
    const endChapter = segment.endChapter ?? segment.startChapter;
    const usedChapterNumbers = Array(endChapter + 1)
      .keys()
      .drop(segment.startChapter)
      .toArray();
    let usedChaptersVerses: BibleVerse[] = [];
    for (const chapter of usedChapterNumbers) {
      usedChaptersVerses = usedChaptersVerses.concat(
        await bibleService.getBibleVerses(translation, book, chapter),
      );
    }
    const findVerse = (chapter: number, verse: number) => (e: BibleVerse) =>
      e.chapter == chapter && e.verse == verse;

    const startVerseIndex = usedChaptersVerses.findIndex(
      findVerse(segment.startChapter, segment.startVerse),
    );
    const endVerseIndex = usedChaptersVerses.findIndex(
      findVerse(endChapter, segment.endVerse),
    );
    console.log([startVerseIndex, endVerseIndex]);
    return usedChaptersVerses.splice(
      startVerseIndex,
      endVerseIndex - startVerseIndex + 1,
    );
  };

  return {
    formatBibleLocation,
    formatBiblePassageLocation,
    passageToText,
    segmentToText,
  };
}
