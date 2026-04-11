import type { Prayer } from '@/shared/types/prayer/prayer.types';
import type { PsalmMetadata } from '@/shared/types/psalter/psalter.types';
import type { Axios } from 'axios';

export class PsalterService {
  protected client: Axios;

  constructor(client: Axios) {
    this.client = client;
  }

  public async listPsalms(language: string): Promise<PsalmMetadata[]> {
    const result = await this.client.get(
      `/psalter/psalms?language=${language}`,
    );
    if (result) {
      return result.data as PsalmMetadata[];
    }
    return [];
  }

  public async getKathisma(
    language: string,
    number: number,
  ): Promise<Prayer | undefined> {
    const result = await this.client.get(
      `/psalter/kathisma?language=${language}&number=${number}`,
    );
    if (result) {
      return result.data as Prayer;
    }
    return undefined;
  }

  public async getPsalm(
    language: string,
    number: number,
  ): Promise<Prayer | undefined> {
    const result = await this.client.get(
      `/psalter/psalm?language=${language}&number=${number}`,
    );
    if (result) {
      return result.data as Prayer;
    }
    return undefined;
  }
}
