import type { Axios } from 'axios';
import { HttpError } from '@/shared/httpClient/http.errors';
import type {
  Bookmark,
  UserVerseMetadata,
} from '@/shared/types/user/user.types';
import {
  getTranslationBookmarksSchema,
  getChapterUserMetadata,
  createUserVerseMetadata,
  getUserGroupsSchema,
} from './userService.schema';
import type { BibleLocation } from '@/shared/types/bible/bible.types';
import type { Group } from '@/shared/types/auth/auth.types';
import { useAuthStore } from '@/modules/auth/authStore';

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

  public async moveBookmark(
    id: string,
    location: BibleLocation,
  ): Promise<BibleLocation | undefined> {
    const response = await this.client.request({
      method: 'put',
      url: 'user/bookmarks/move',
      data: {
        id: id,
        location: location,
      },
    });
    if (response.status == 401) {
      return undefined;
    }
    return response.data as BibleLocation;
  }

  public async createBookmark(
    bookmark: Bookmark,
  ): Promise<Bookmark | undefined> {
    const response = await this.client.post('user/bookmarks', bookmark);
    if (response.status == 401) {
      return undefined;
    }
    return response.data as Bookmark;
  }

  public async loadMetadataFromChapter(
    translation: string,
    book: number,
    chapter: number,
  ): Promise<UserVerseMetadata[]> {
    const response = await this.client.get(
      `user/user-verse-metadata?translation=${translation}&book=${book}&chapter=${chapter}`,
    );
    if (response.status == 401) {
      return [];
    }
    const validatedData = getChapterUserMetadata.safeParse(response.data);
    if (!validatedData.success) {
      throw new HttpError();
    }
    return validatedData.data as UserVerseMetadata[];
  }

  public async createVerseMetadata(
    metadata: UserVerseMetadata,
  ): Promise<UserVerseMetadata | undefined> {
    const response = await this.client.post(
      'user/user-verse-metadata',
      metadata,
    );
    if (response.status == 401) {
      return undefined;
    }
    const validatedData = createUserVerseMetadata.safeParse(response.data);
    if (!validatedData.success) {
      throw new HttpError();
    }
    return validatedData.data as UserVerseMetadata;
  }

  public async updateVerseMetadata(
    metadata: UserVerseMetadata,
  ): Promise<UserVerseMetadata> {
    console.log(metadata);
    return await this.client.put(`user/user-verse-metadata`, {
      id: metadata.id,
      noteText: metadata.noteText,
      highlightColor: metadata.highlightColor,
    });
  }

  public async getUserGroups(): Promise<Group[]> {
    const response = await this.client.get(
      `admin/user-groups/${useAuthStore().getId()}`,
    );
    if (response.status == 401) {
      return [];
    }
    const validatedData = getUserGroupsSchema.safeParse(response.data);
    if (!validatedData.success) {
      throw new HttpError();
    }
    return validatedData.data as Group[];
  }
}
