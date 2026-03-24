import type { Prayer } from '@/shared/types/prayer/prayer.types';
import type { Axios } from 'axios';

export class PsalterService {
  protected client: Axios;

  constructor(client: Axios) {
    this.client = client;
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
}
