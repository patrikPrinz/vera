import type { Generated } from 'kysely';

export interface Database {
  user_details: UserDetailsTable;
  auth_provider: AuthProviderTable;
  authentication: AuthenticationTable;
  credentials: CredentialsTable;
  user_bookmarks: UserBookmarksTable;
  bible_user_metadata: BibleUserMetadataTable;
}

export interface UserDetailsTable {
  id: Generated<string>;
  username: string | null;
  email: string;
}

export interface AuthProviderTable {
  id: Generated<number>;
  code: string;
  name: string;
}
export interface AuthenticationTable {
  id: Generated<string>;
  user_id: string;
  provider_id: number;
  provider_account_identifier: string;
}

export interface CredentialsTable {
  id: Generated<string>;
  authentication_id: string;
  password_hash: string;
}

// user data
export interface UserBookmarksTable {
  id: Generated<string>;
  bible_translation: string;
  bible_book: number;
  bible_chapter: number;
  bible_verse: number;
  author_id: string;
  bookmark_name: string;
}

export interface BibleUserMetadataTable {
  id: Generated<string>;
  bible_translation: string;
  bible_book: number;
  bible_chapter: number;
  bible_verse: number;
  author_id: string;
  highlight_color: string | null;
  note_text: string | null;
}
