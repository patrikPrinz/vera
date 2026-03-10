import { inject, injectable } from 'tsyringe';
import { BookmarkRepository } from './repositories/bookmark.repository.js';
import type { VerseMetadataRepository } from './repositories/verseMetadata.repository.js';
import type { Bookmark, UserVerseMetadata } from './user.types.js';
import {
  AppError,
  NotFoundError,
  PermissionError,
} from '../../shared/error_handler/errors.js';
import type { BibleChapter, BibleLocation } from '../bible/bible.types.js';

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

  // **************
  // verse metadata
  // **************

  findVerseMetadataById = async (
    userId: string,
    id: string,
  ): Promise<UserVerseMetadata> => {
    const bookmark =
      await this.verseMetadataRepository.findVerseMetadatakById(id);
    if (!bookmark) {
      throw new NotFoundError();
    }
    if (userId !== bookmark.authorId) {
      throw new PermissionError();
    }
    return bookmark;
  };

  findVerseMetadataByTranslation = async (
    userId: string,
    translation: string,
  ): Promise<UserVerseMetadata[]> => {
    const bookmarks =
      await this.verseMetadataRepository.findVerseMetadataByTranslation(
        userId,
        translation,
      );
    return bookmarks;
  };

  findVerseMetadataByChapter = async (
    userId: string,
    location: BibleChapter,
  ): Promise<UserVerseMetadata[]> => {
    const bookmarks =
      await this.verseMetadataRepository.findVerseMetadataByChapter(
        userId,
        location,
      );
    return bookmarks;
  };

  createVerseMetadata = async (
    userId: string,
    metadata: UserVerseMetadata,
  ): Promise<UserVerseMetadata> => {
    console.log(userId);
    if (userId != metadata.authorId) {
      throw new PermissionError();
    }
    const insertedData =
      await this.verseMetadataRepository.InsertVerseMetadata(metadata);
    if (!insertedData) {
      throw new AppError();
    }
    metadata.id = insertedData;
    return metadata;
  };

  deleteVerseMetadata = async (
    userId: string,
    id: string,
  ): Promise<boolean> => {
    const metadataFromDb =
      await this.verseMetadataRepository.findVerseMetadatakById(id);
    if (!metadataFromDb) {
      throw new NotFoundError();
    }
    if (userId !== metadataFromDb.authorId) {
      throw new PermissionError();
    }
    const deletedData =
      await this.verseMetadataRepository.deleteVerseMetadata(id);
    return deletedData > 0;
  };

  editVerseMetadata = async (
    userId: string,
    id: string,
    noteText: string,
    highlightColor: string | null,
  ): Promise<UserVerseMetadata> => {
    const metadataFromDb =
      await this.verseMetadataRepository.findVerseMetadatakById(id);
    console.log(userId);
    console.log(metadataFromDb);
    if (!metadataFromDb) {
      throw new NotFoundError();
    }
    if (String(userId) !== metadataFromDb.authorId) {
      throw new PermissionError();
    }
    await this.verseMetadataRepository.editVerseMetadata(
      id,
      noteText,
      highlightColor,
    );
    metadataFromDb.noteText = noteText;
    metadataFromDb.highlightColor = highlightColor;
    return metadataFromDb;
  };
}
