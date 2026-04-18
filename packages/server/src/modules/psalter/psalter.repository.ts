import { injectable, inject } from 'tsyringe';
import type { ElasticAdapter } from '../../shared/elastic/elastic_adapter.js';
import type {
  Psalm,
  PsalmMetadata,
  PsalmRecord,
  PsalmsQueryRequest,
} from './psalter.types.js';

interface RawPsalm {
  language: string;
  kathisma_number: string;
  psalm_number: string;
  title: string;
  text_segments: string[];
  stasis_end: boolean;
}

@injectable()
export class PsalterRepository {
  protected psalmIndex: string;
  protected adapter: ElasticAdapter;

  constructor(@inject('ElasticAdapter') adapter: ElasticAdapter) {
    this.psalmIndex = 'psalm';
    this.adapter = adapter;
  }

  public async listPsalms(language: string): Promise<PsalmMetadata[]> {
    const psalms = await this.adapter.search(this.psalmIndex, {
      match: { language: language },
    });
    if (psalms.length == 0) {
      return [];
    }
    return psalms.map((e) => {
      const fields = e._source as RawPsalm;
      return {
        language: fields.language,
        psalmNumber: new Number(fields.psalm_number),
        title: fields.title,
      } as PsalmMetadata;
    });
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
    const fields = hit as RawPsalm;
    return {
      language: fields.language,
      kathismaNumber: new Number(fields.kathisma_number),
      psalmNumber: new Number(fields.psalm_number),
      title: fields.title,
      segments: fields.text_segments,
      stasisEnd: fields.stasis_end,
    } as Psalm;
  }

  async importPsalter(data: PsalmRecord[]): Promise<void> {
    await this.adapter.bulkIndex(this.psalmIndex, data);
  }
}
