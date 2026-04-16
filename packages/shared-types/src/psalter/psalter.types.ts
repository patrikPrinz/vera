export interface PsalmsQueryRequest {
  language: string;
  mode: 'psalm' | 'kathisma';
  number: number;
}

export interface Psalm {
  language: string;
  kathismaNumber: number;
  psalmNumber: number;
  title: string;
  segments: string[];
  stasisEnd: boolean;
}

export interface PsalmMetadata {
  language: string;
  psalmNumber: number;
  title: string;
}

export interface Kathisma {
  language: string;
  kathismaNumber: number;
}

export interface PsalmRecord {
  language: string;
  kathisma_number: number;
  psalm_number: number;
  title: string;
  segments: string[];
  stasis_end: boolean;
}
