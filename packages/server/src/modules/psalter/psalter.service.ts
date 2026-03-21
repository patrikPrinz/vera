import { inject, injectable } from 'tsyringe';
import type { PsalterRepository } from './psalter.repository.js';
import type {
  Prayer,
  PrayerVerse,
} from '../../shared/types/prayer/prayer.types.js';
import { NotFoundError } from '../../shared/error_handler/errors.js';
import type { Psalm } from './psalter.types.js';

@injectable()
export class PsalterService {
  protected psalterRepository: PsalterRepository;

  constructor(
    @inject('PsalterRepository') psalterRepository: PsalterRepository,
  ) {
    this.psalterRepository = psalterRepository;
  }

  psalmToPrayerText(psalm: Psalm, standalone: boolean = true): PrayerVerse[] {
    let text: PrayerVerse[] = [];
    if (!standalone) {
      text.push(this.makeTitle(psalm.title));
    }
    if (psalm.segments.length > 1) {
      for (const segment of psalm.segments) {
        text.push(this.psalmSegmentToPrayerText(segment));
        if (!standalone) {
          text = text.concat(this.stasisEnd(psalm.language));
        }
      }
    } else {
      text.push(this.psalmSegmentToPrayerText(psalm.segments[0]));
      if (!standalone && psalm.stasisEnd) {
        console.log(psalm.stasisEnd);
        text = text.concat(this.stasisEnd(psalm.language));
      }
    }
    return text;
  }

  makeTitle(title: string): PrayerVerse {
    return {
      type: 'title',
      text: title,
    } as PrayerVerse;
  }

  psalmSegmentToPrayerText(segment: string) {
    return {
      type: 'text',
      text: segment,
    } as PrayerVerse;
  }

  stasisEnd(language: string): PrayerVerse[] {
    console.log('InsertEnding');
    const endings = {
      CZE: [
        {
          type: 'text',
          text: 'Sláva Otci i Synu i Svatému Duchu i nyní i vždycky a na věky věků. Amen.',
        },
        {
          type: 'text',
          text: 'Aleluja, aleluja, aleluja. Sláva tobě, Bože.',
          noteAfter: '3x',
        },
        {
          type: 'text',
          text: 'Pane, smiluj se. Pane, smiluj se. Pane, smiluj se.',
        },
        {
          type: 'text',
          text: 'Sláva Otci i Synu i Svatému Duchu i nyní i vždycky a na věky věků. Amen.',
        },
      ],
    };
    return endings[language] as PrayerVerse[];
  }

  public async getPsalm(
    language: string,
    psalmNumber: number,
  ): Promise<Prayer> {
    const psalmData = await this.psalterRepository.getPsalm(
      language,
      psalmNumber,
    );
    console.log(psalmData);
    if (psalmData) {
      return {
        language: language,
        title: psalmData.title,
        verses: this.psalmToPrayerText(psalmData, false),
      } as Prayer;
    } else throw new NotFoundError('Psalm not found.');
  }

  public async getKathisma(language: string, kathismaNumber: number) {
    const kathismaPsalmData = await this.psalterRepository.getKathismaPsalms(
      language,
      kathismaNumber,
    );

    if (kathismaPsalmData.length == 0) {
      throw new NotFoundError('Kathisma not found.');
    }

    let kathismaText: PrayerVerse[] = [];
    kathismaPsalmData.forEach((e) => {
      kathismaText = kathismaText.concat(this.psalmToPrayerText(e, false));
      console.log(e.stasisEnd);
    });

    return {
      language: language,
      title: `Kathisma ${kathismaNumber}`,
      verses: kathismaText,
    } as Prayer;
  }
}
