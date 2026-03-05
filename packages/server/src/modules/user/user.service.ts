import { inject, injectable } from 'tsyringe';
import { BookmarkRepository } from './repositories/bookmark.repository.js';
import type { VerseMetadataRepository } from './repositories/verseMetadata.repository.js';
import type { Bookmark } from './user.types.js';
import {
  NotFoundError,
  PermissionError,
} from '../../shared/error_handler/errors.js';
import type { BibleLocation } from '../bible/bible.types.js';

@injectable()
export class UserService {
  protected bookmarkRepository: BookmarkRepository;
  protected verseMetadataRepository: VerseMetadataRepository;

  constructor(
    @inject('BookmarkRepository') bookmarkRepository: BookmarkRepository,
    @inject('VerseMetadataRepository')
    verseMetadataRepository: VerseMetadataRepository,
  ) {
    this.bookmarkRepository = bookmarkRepository;
    this.verseMetadataRepository = verseMetadataRepository;
  }

  checkBookmarkPermissions = (userId: string, bookmark: Bookmark) => {
    return userId == bookmark.authorId;
  };

  findUserBookmarks = async (
    userId: string,
    translation: string,
  ): Promise<Bookmark[]> => {
    const bookmarks = await this.bookmarkRepository.findBookmarksByTranslation(
      userId,
      translation,
    );
    return bookmarks;
  };

  findBookmarkById = async (id: string): Promise<Bookmark> => {
    const bookmark = await this.bookmarkRepository.findBookmarkById(id);
    if (!bookmark) {
      throw new NotFoundError();
    }
    return bookmark;
  };

  createBookmark = async (
    userId: string,
    bookmark: Bookmark,
  ): Promise<Bookmark> => {
    if (!this.checkBookmarkPermissions(userId, bookmark)) {
      throw new PermissionError();
    }
    const bookmarkId = await this.bookmarkRepository.insertBookmark(bookmark);
    bookmark.id = bookmarkId;
    return bookmark;
  };

  deleteBookmark = async (userId: string, id: string): Promise<boolean> => {
    const bookmarkFromDb = await this.bookmarkRepository.findBookmarkById(id);
    if (!bookmarkFromDb) {
      throw new NotFoundError();
    }
    if (!this.checkBookmarkPermissions(userId, bookmarkFromDb)) {
      throw new PermissionError();
    }
    const deleteOperation = await this.bookmarkRepository.deleteBookmark(id);
    return deleteOperation > 0;
  };

  moveBookmark = async (
    userId: string,
    id: string,
    newLocation: BibleLocation,
  ): Promise<BibleLocation> => {
    const bookmark = await this.bookmarkRepository.findBookmarkById(id);
    if (!bookmark) {
      throw new NotFoundError();
    }
    if (!this.checkBookmarkPermissions(userId, bookmark)) {
      throw new PermissionError();
    }
    const movedBookmark = await this.bookmarkRepository.moveBookmark(
      id,
      newLocation,
    );
    return movedBookmark;
  };
}
