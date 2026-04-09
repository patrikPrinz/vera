import { HttpError } from '@/shared/httpClient/http.errors';
import type { BiblePassage } from '@/shared/types/bible/passage.types';
import type { Axios } from 'axios';

export class PassagesService {
  protected client: Axios;

  constructor(client: Axios) {
    this.client = client;
  }

  public async findPassagesByDate(date: string): Promise<BiblePassage[]> {
    const response = await this.client.get(`bible/passage/date/${date}`);
    if (response.data) {
      return response.data as BiblePassage[];
    } else return [];
  }

  public async findPassagesByAuthor(author: string): Promise<BiblePassage[]> {
    const response = await this.client.get(`bible/passage/author/${author}`);
    if (response.data) {
      return response.data as BiblePassage[];
    } else return [];
  }

  public async findPassageById(id: string): Promise<BiblePassage | undefined> {
    const response = await this.client.get(`bible/passage/id/${id}`);
    if (response.data) {
      return response.data as BiblePassage;
    } else return undefined;
  }

  public async updatePassage(passage: BiblePassage): Promise<boolean> {
    const response = await this.client.put('bible/passage', {
      passage: passage,
    });
    if (response.data !== undefined) {
      return response.data as boolean;
    } else throw new HttpError();
  }

  public async createPassage(
    passage: BiblePassage,
  ): Promise<BiblePassage | undefined> {
    const response = await this.client.post(`bible/passage`, {
      passage: passage,
    });
    if (response.data) {
      return response.data as BiblePassage;
    }
    return undefined;
  }
}
