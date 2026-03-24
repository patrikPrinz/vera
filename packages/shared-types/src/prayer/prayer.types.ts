export interface Prayer {
  language: string;
  title: string;
  verses: PrayerVerse[];
}

export type PrayerVerse = TextBlock | ReferenceBlock;

interface TextBlock {
  type: 'text' | 'rubric' | 'title';
  speaker?: string;
  text: string;
  noteAfter?: string;
}

interface ReferenceBlock {
  id: string;
}
