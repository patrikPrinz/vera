import { injectable, inject } from 'tsyringe';
import type { ElasticAdapter } from '../../shared/elastic/elastic_adapter.js';
import type { Psalm, PsalmsQueryRequest } from './psalter.types.js';

@injectable()
export class PsalterRepository {
  protected psalmIndex: string;
  protected adapter: ElasticAdapter;

  constructor(@inject('ElasticAdapter') adapter: ElasticAdapter) {
    this.psalmIndex = 'psalm';
    this.adapter = adapter;
  }

  public async getPsalm(
    language: string,
    psalmNumber: number,
  ): Promise<Psalm | undefined> {
    const psalms = await this.getPsalms({
      language: language,
      mode: 'psalm',
      number: psalmNumber,
    });
    if (psalms.length > 0) {
      return psalms[0];
    }
    return undefined;
  }

  public async getKathismaPsalms(
    language: string,
    kathismaNumber: number,
  ): Promise<Psalm[]> {
    const psalms = await this.getPsalms({
      language: language,
      mode: 'kathisma',
      number: kathismaNumber,
    });
    if (psalms) {
      return psalms;
    }
    return [];
  }

  public async getPsalms(request: PsalmsQueryRequest): Promise<Psalm[]> {
    const findMode = () => {
      if (request.mode == 'kathisma') {
        return {
          kathisma_number: request.number,
        };
      } else {
        return {
          psalm_number: request.number,
        };
      }
    };

    const query = {
      bool: {
        must: [
          {
            match: {
              language: request.language,
            },
          },
          {
            match: findMode(),
          },
        ],
      },
    };

    const data = await this.adapter.search(this.psalmIndex, query);

    if (!data || data.length == 0) {
      return undefined;
    }
    return data.map((e) => this.mapHitToPsalm(e._source));
  }

  mapHitToPsalm(hit: unknown): Psalm {
    const fields = hit as {
      language: string;
      kathisma_number: string;
      psalm_number: string;
      title: string;
      text_segments: string[];
      stasis_end: boolean;
    };
    return {
      language: fields.language,
      kathismaNumber: new Number(fields.kathisma_number),
      psalmNumber: new Number(fields.psalm_number),
      title: fields.title,
      segments: fields.text_segments,
      stasisEnd: fields.stasis_end,
    } as Psalm;
  }
}
