export interface BiblePassage {
  id?: string;
  authorId: string;
  title?: string | null;
  slug?: string | null;
  calendarDate?: string | null;
  priority?: number | null;
  passageLocation: PassageLocation;
  createdAt?: string;
}

export interface PassageLocation {
  book: number;
  segments: PassageSegment[];
}

export interface PassageSegment {
  startChapter: number;
  startVerse: number;
  endChapter?: number;
  endVerse: number;
}
