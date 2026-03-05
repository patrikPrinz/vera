import type { Axios } from 'axios';
import { HttpError } from '@/shared/httpClient/http.errors';
import type { Bookmark } from '@/shared/types/user/user.types';
import { getTranslationBookmarksSchema } from './userService.schema';

export class UserService {
  protected client: Axios;
  constructor(client: Axios) {
    this.client = client;
  }

  public async getTranslationBookmrks(
    translation: string,
  ): Promise<Bookmark[]> {
    const response = await this.client.get(`user/bookmarks/${translation}`);
    if (response.status == 401) {
      return [];
    }
    const validatedData = getTranslationBookmarksSchema.safeParse(
      response.data,
    );
    if (!validatedData.success) {
      throw new HttpError();
    }
    return validatedData.data as Bookmark[];
  }

  public async removeBookmark(bookmark: Bookmark): Promise<boolean> {
    return (await this.client.delete(`user/bookmarks/${bookmark.id}`))
      .data as boolean;
  }
}
