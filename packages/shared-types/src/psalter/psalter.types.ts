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

export interface Kathisma {
  language: string;
  kathismaNumber: number;
}
