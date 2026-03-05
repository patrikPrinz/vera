import type { BibleLocation } from '../bible/bible.types.js';

export interface Bookmark {
  id?: string;
  authorId: string;
  name: string;
  location: BibleLocation;
}

export interface UserVerseMetadata {
  id?: string;
  authorId: string;
  noteText?: string;
  highlightColor?: string;
  location: BibleLocation;
}
