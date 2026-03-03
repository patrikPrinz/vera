import type { BibleLocation } from '../bible/bible.types.js';

export interface Bookmark {
  id?: string;
  name: string;
  location: BibleLocation;
}
