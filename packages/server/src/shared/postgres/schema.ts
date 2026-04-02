import type { Generated, JSONColumnType } from 'kysely';
import type { PassageLocation } from '../types/bible/passage.types.js';

export interface Database {
  user_details: UserDetailsTable;
  auth_provider: AuthProviderTable;
  authentication: AuthenticationTable;
  credentials: CredentialsTable;
  user_bookmarks: UserBookmarksTable;
  bible_user_metadata: BibleUserMetadataTable;
  groups: GroupsTable;
  user_groups: UserGroupsTable;
  roles: RolesTable;
  user_roles: UserRolesTable;
  group_content: GroupContentTable;
  bible_passage: BiblePassageTable;
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

export interface GroupsTable {
  id: Generated<string>;
  name: string;
}

export interface UserGroupsTable {
  id: Generated<string>;
  user_id: string;
  group_id: string;
}

export interface RolesTable {
  id: Generated<string>;
  code: string;
  name: string;
  is_group_role: boolean;
}

export interface UserRolesTable {
  id: Generated<string>;
  user_id: string;
  role_id: string;
  group_id: string | null;
}

export interface GroupContentTable {
  id: Generated<string>;
  author_id: string;
  group_id: string;
  title: string;
  content: string;
  created_at: string;
  archived: boolean;
}

export interface BiblePassageTable {
  id: Generated<string>;
  author_id: string;
  title: string | null;
  slug: string | null;
  calendar_date: string | null;
  priority: number | null;
  passage_location: JSONColumnType<
    PassageLocation,
    PassageLocation,
    PassageLocation
  >;
  created_at: string;
}
